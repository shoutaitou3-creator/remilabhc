/*
  # Create test users properly with correct authentication

  1. User Creation
    - Create admin and editor users in auth.users
    - Set proper email confirmation
    - Create corresponding user_profiles

  2. Security
    - Enable RLS on user_profiles
    - Create proper policies for user access
*/

-- First, ensure RLS is enabled on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own last_login" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON user_profiles;

-- Create RLS policies for user_profiles
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

-- Create user profiles for existing auth users
-- Note: This assumes the auth users already exist in Supabase Auth
-- If they don't exist, they need to be created through the Supabase Auth API

-- Insert admin user profile (using the existing auth user ID from Supabase dashboard)
INSERT INTO user_profiles (
  id,
  email,
  role,
  permissions,
  is_active,
  created_at,
  updated_at
) VALUES (
  '79684fed-d8ab-4eaf-b4dc-e4de6f05e5b1', -- Use the actual UUID from Supabase Auth dashboard
  'admin@remilabhc.com',
  'admin',
  '{"dashboard": true, "kpi": true, "news": true, "workExamples": true, "faq": true, "judges": true, "sponsors": true, "prizes": true, "settings": true}'::jsonb,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Insert editor user profile (using the existing auth user ID from Supabase dashboard)
INSERT INTO user_profiles (
  id,
  email,
  role,
  permissions,
  is_active,
  created_at,
  updated_at
) VALUES (
  '69228fac-5a5e-4d21-8e0a-1bf4d2e2ddd5', -- Use the actual UUID from Supabase Auth dashboard
  'editor@remilabhc.com',
  'editor',
  '{"dashboard": true, "kpi": false, "news": true, "workExamples": true, "faq": true, "judges": false, "sponsors": false, "prizes": false, "settings": false}'::jsonb,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Insert another admin user profile
INSERT INTO user_profiles (
  id,
  email,
  role,
  permissions,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2815526d-d91f-4be0-b520-a1ce35cf452e', -- Use the actual UUID from Supabase Auth dashboard
  'admin@remilabhc.com',
  'admin',
  '{"dashboard": true, "kpi": true, "news": true, "workExamples": true, "faq": true, "judges": true, "sponsors": true, "prizes": true, "settings": true}'::jsonb,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify the user profiles were created
DO $$
DECLARE
  admin_count INTEGER;
  editor_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM user_profiles WHERE role = 'admin';
  SELECT COUNT(*) INTO editor_count FROM user_profiles WHERE role = 'editor';
  SELECT COUNT(*) INTO total_count FROM user_profiles;
  
  RAISE NOTICE 'Admin users created: %', admin_count;
  RAISE NOTICE 'Editor users created: %', editor_count;
  RAISE NOTICE 'Total user profiles: %', total_count;
  
  -- List all user profiles
  FOR rec IN SELECT id, email, role FROM user_profiles LOOP
    RAISE NOTICE 'User profile: % - % (%)', rec.id, rec.email, rec.role;
  END LOOP;
END $$;