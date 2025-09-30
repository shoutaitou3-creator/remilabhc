/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem Analysis
    - The "Admins can manage all user profiles" policy with FOR ALL was causing infinite recursion
    - During INSERT operations, the policy tries to check user_profiles table while inserting into it
    - This creates a circular dependency and infinite loop

  2. Solution
    - Remove the problematic FOR ALL policy
    - Create separate policies for each operation (SELECT, INSERT, UPDATE, DELETE)
    - Use direct email checking from auth.users for admin detection
    - Avoid self-referencing in INSERT policy

  3. Security
    - Maintain proper access control
    - Allow users to read/update their own profiles
    - Allow admins to manage all profiles
    - Prevent infinite recursion during user creation
*/

-- First, safely drop all existing policies for user_profiles
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow user profile creation" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete user profiles" ON user_profiles;

-- Create new safe policies without infinite recursion

-- 1. SELECT policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all user profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text = ANY (ARRAY['admin@remilabhc.com'::text, 'admin@resusty.com'::text])
  );

-- 2. INSERT policy (safe - no self-reference)
CREATE POLICY "Allow user profile creation"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow users to create their own profile
    auth.uid() = id
    OR
    -- Allow admins to create any profile (direct email check)
    (auth.jwt() ->> 'email')::text = ANY (ARRAY['admin@remilabhc.com'::text, 'admin@resusty.com'::text])
  );

-- 3. UPDATE policies
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update all user profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text = ANY (ARRAY['admin@remilabhc.com'::text, 'admin@resusty.com'::text])
  )
  WITH CHECK (
    (auth.jwt() ->> 'email')::text = ANY (ARRAY['admin@remilabhc.com'::text, 'admin@resusty.com'::text])
  );

-- 4. DELETE policy
CREATE POLICY "Admins can delete user profiles"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email')::text = ANY (ARRAY['admin@remilabhc.com'::text, 'admin@resusty.com'::text])
  );

-- Ensure the handle_new_user function is safe and doesn't cause recursion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    -- Log the new user creation attempt
    RAISE LOG 'handle_new_user triggered for user: %', NEW.id;
    
    -- Insert user profile with default editor permissions
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
    
    RAISE LOG 'User profile created successfully for: %', NEW.email;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the authentication
    RAISE LOG 'Error creating user profile for %: % %', NEW.email, SQLERRM, SQLSTATE;
    -- Continue with authentication even if profile creation fails
  END;
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();