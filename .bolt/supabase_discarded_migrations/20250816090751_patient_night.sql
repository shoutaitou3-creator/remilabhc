/*
  # Fix duplicate user error and setup proper authentication

  1. Cleanup
    - Remove existing user_profiles data
    - Reset auto-increment sequences if any

  2. Security
    - Ensure RLS is properly configured
    - Create proper policies for user access

  3. User Creation
    - Use UPSERT to handle existing users
    - Ensure proper data consistency
*/

-- First, clean up existing data to avoid conflicts
DELETE FROM user_profiles WHERE email IN ('admin@remilabhc.com', 'editor@remilabhc.com');

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own last_login" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON user_profiles;

-- Create comprehensive RLS policies
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

-- Admin policy for full access
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

-- Create a function to safely insert user profiles
CREATE OR REPLACE FUNCTION insert_user_profile_safe(
  user_id UUID,
  user_email TEXT,
  user_role TEXT DEFAULT 'editor',
  user_permissions JSONB DEFAULT '{"dashboard": true, "kpi": false, "news": false, "workExamples": false, "faq": false, "judges": false, "sponsors": false, "prizes": false, "settings": false}'::jsonb
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use UPSERT to handle existing records
  INSERT INTO user_profiles (
    id,
    email,
    role,
    permissions,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    user_email,
    user_role,
    user_permissions,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    role = user_role,
    permissions = user_permissions,
    is_active = true,
    updated_at = NOW();
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error inserting user profile: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Note: Actual user creation must be done through Supabase Dashboard
-- This migration only prepares the user_profiles table structure

-- Verify the cleanup
DO $$
BEGIN
  RAISE NOTICE 'User profiles table cleaned up. Current count: %', (SELECT COUNT(*) FROM user_profiles);
  RAISE NOTICE 'Ready for manual user creation via Supabase Dashboard';
END $$;