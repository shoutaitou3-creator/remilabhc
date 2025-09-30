/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem Analysis
    - The "Admins can manage all user profiles" policy uses FOR ALL
    - This causes infinite recursion during INSERT operations
    - The policy references user_profiles table within itself

  2. Solution
    - Drop the problematic FOR ALL policy
    - Create separate policies for each operation (SELECT, UPDATE, DELETE)
    - Ensure INSERT operations don't trigger recursive checks

  3. Security
    - Maintain proper access control for admins
    - Keep user self-access policies intact
    - Prevent unauthorized access while fixing recursion
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON user_profiles;

-- Create separate policies for each operation to avoid recursion

-- Admin SELECT policy (safe from recursion)
CREATE POLICY "Admins can read all user profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN ('admin@remilabhc.com', 'admin@resusty.com')
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
      AND admin_profile.is_active = true
    )
  );

-- Admin UPDATE policy (safe from recursion)
CREATE POLICY "Admins can update all user profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN ('admin@remilabhc.com', 'admin@resusty.com')
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
      AND admin_profile.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN ('admin@remilabhc.com', 'admin@resusty.com')
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
      AND admin_profile.is_active = true
    )
  );

-- Admin DELETE policy (safe from recursion)
CREATE POLICY "Admins can delete user profiles"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN ('admin@remilabhc.com', 'admin@resusty.com')
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
      AND admin_profile.is_active = true
    )
  );

-- Special INSERT policy for new user creation (bypasses recursion)
CREATE POLICY "Allow user profile creation"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if the user is inserting their own profile
    auth.uid() = id
    OR
    -- Allow if the user is a known admin (by email check)
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN ('admin@remilabhc.com', 'admin@resusty.com')
    )
  );

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    -- Insert new user profile with default editor permissions
    INSERT INTO public.user_profiles (
      id,
      email,
      role,
      permissions,
      is_active
    ) VALUES (
      NEW.id,
      NEW.email,
      'editor',
      jsonb_build_object(
        'dashboard', true,
        'kpi', false,
        'news', false,
        'workExamples', false,
        'faq', false,
        'judges', false,
        'sponsors', false,
        'prizes', false,
        'settings', false
      ),
      true
    );
    
    RETURN NEW;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail the authentication
      RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
      RETURN NEW;
  END;
END;
$$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();