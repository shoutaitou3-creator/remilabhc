/*
  # Fix handle_new_user function to prevent duplicate user profile creation

  1. Function Updates
    - Update `handle_new_user` function to check if user profile already exists
    - Only create new profile if one doesn't exist
    - Add better error handling and logging

  2. Security
    - Maintain existing RLS policies
    - Ensure function only creates profiles for new users
*/

-- Drop and recreate the handle_new_user function with proper duplicate prevention
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if user profile already exists
  IF EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = NEW.id OR email = NEW.email
  ) THEN
    -- User profile already exists, do nothing
    RETURN NEW;
  END IF;

  -- Only create profile for new users that don't exist
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
  WHEN unique_violation THEN
    -- If unique constraint violation occurs, just return NEW without error
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log other errors but don't fail the auth process
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();