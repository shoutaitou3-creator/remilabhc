/*
  # Fix all trigger functions and policies

  1. Drop and recreate all trigger functions properly
  2. Fix RLS policies for user_profiles
  3. Ensure proper authentication flow
  4. Add error handling to all functions
*/

-- Drop all existing trigger functions to start fresh
DROP FUNCTION IF EXISTS update_user_profile_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_user_profiles_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_judges_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_news_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_news_categories_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_theme_settings_updated_at() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_last_login() CASCADE;

-- Create a generic updated_at function that can be used by all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create specific functions for each table (for clarity and debugging)
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_judges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_news_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_theme_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create handle_new_user function with proper error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the authentication
    RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create update_last_login function
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    UPDATE public.user_profiles 
    SET last_login_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail
    RAISE WARNING 'Failed to update last login for %: %', NEW.id, SQLERRM;
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop all existing triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_judges_updated_at ON judges;
DROP TRIGGER IF EXISTS update_news_updated_at ON news;
DROP TRIGGER IF EXISTS update_news_categories_updated_at ON news_categories;
DROP TRIGGER IF EXISTS update_theme_settings_updated_at ON theme_settings;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate all triggers with correct function names
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

CREATE TRIGGER update_judges_updated_at
  BEFORE UPDATE ON judges
  FOR EACH ROW
  EXECUTE FUNCTION update_judges_updated_at();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_news_updated_at();

CREATE TRIGGER update_news_categories_updated_at
  BEFORE UPDATE ON news_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_news_categories_updated_at();

CREATE TRIGGER update_theme_settings_updated_at
  BEFORE UPDATE ON theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_theme_settings_updated_at();

-- Create auth trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Drop and recreate RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own last_login" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON user_profiles;

-- Recreate RLS policies with better error handling
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all user profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
      AND is_active = true
    )
  );

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.site_settings TO authenticated;
GRANT ALL ON public.judges TO authenticated;
GRANT ALL ON public.sponsors TO authenticated;
GRANT ALL ON public.main_prizes TO authenticated;
GRANT ALL ON public.additional_prizes TO authenticated;
GRANT ALL ON public.news TO authenticated;
GRANT ALL ON public.news_categories TO authenticated;
GRANT ALL ON public.faqs TO authenticated;
GRANT ALL ON public.work_examples TO authenticated;
GRANT ALL ON public.theme_settings TO authenticated;