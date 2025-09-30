/*
  # Fix trigger functions for user authentication

  1. Fix trigger functions
    - Create proper `update_user_profiles_updated_at` function
    - Fix `update_user_profile_updated_at` function reference
    - Ensure all trigger functions exist and work correctly

  2. Security
    - Maintain existing RLS policies
    - Ensure authentication flow works properly
*/

-- Drop existing problematic trigger first
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;

-- Create or replace the correct trigger function
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger with correct function name
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Also fix the judges trigger function if it's using wrong function name
DROP TRIGGER IF EXISTS update_judges_updated_at ON judges;

CREATE OR REPLACE FUNCTION update_judges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_judges_updated_at
  BEFORE UPDATE ON judges
  FOR EACH ROW
  EXECUTE FUNCTION update_judges_updated_at();

-- Fix other trigger functions that might have naming issues
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_news_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_theme_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the handle_new_user function exists and works correctly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, permissions, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    'editor',
    '{"dashboard": true, "kpi": false, "news": false, "workExamples": false, "faq": false, "judges": false, "sponsors": false, "prizes": false, "settings": false}'::jsonb,
    true
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the authentication
    RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();