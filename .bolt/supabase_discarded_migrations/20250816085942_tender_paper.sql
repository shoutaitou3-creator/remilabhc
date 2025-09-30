/*
  # Cleanup existing user data and prepare for fresh setup

  1. Data Cleanup
    - Remove all existing user_profiles data
    - Clean up any orphaned authentication data
  
  2. Security Setup
    - Ensure proper RLS policies are in place
    - Set up admin access policies
  
  3. Preparation
    - Prepare tables for fresh user creation
*/

-- First, disable RLS temporarily for cleanup
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Delete all existing user profiles
DELETE FROM user_profiles;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own last_login" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON user_profiles;

-- Create clean RLS policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own last_login"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create admin policy for full access
CREATE POLICY "Admins can manage all user profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verify cleanup
DO $$
BEGIN
  RAISE NOTICE 'User profiles cleanup completed. Current count: %', (SELECT COUNT(*) FROM user_profiles);
  RAISE NOTICE 'Ready for fresh user creation via Supabase Dashboard';
END $$;