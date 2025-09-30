/*
  # Recreate user profiles correctly

  1. Create user profiles for existing auth users
    - Match auth.users with user_profiles using UUID
    - Set appropriate roles and permissions
    - Ensure data consistency

  2. Security
    - Maintain existing RLS policies
    - Ensure proper foreign key relationships
*/

-- まず、auth.usersに存在するユーザーのIDを確認して、対応するuser_profilesを作成

-- 管理者ユーザープロフィールを作成
INSERT INTO user_profiles (
  id,
  email,
  role,
  permissions,
  is_active,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  'admin'::text,
  '{
    "dashboard": true,
    "kpi": true,
    "news": true,
    "workExamples": true,
    "faq": true,
    "judges": true,
    "sponsors": true,
    "prizes": true,
    "settings": true
  }'::jsonb,
  true,
  now(),
  now()
FROM auth.users au
WHERE au.email = 'admin@remilabhc.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles up WHERE up.id = au.id
  );

-- 編集者ユーザープロフィールを作成
INSERT INTO user_profiles (
  id,
  email,
  role,
  permissions,
  is_active,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  'editor'::text,
  '{
    "dashboard": true,
    "kpi": false,
    "news": true,
    "workExamples": true,
    "faq": true,
    "judges": false,
    "sponsors": false,
    "prizes": false,
    "settings": false
  }'::jsonb,
  true,
  now(),
  now()
FROM auth.users au
WHERE au.email = 'editor@remilabhc.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles up WHERE up.id = au.id
  );

-- 作成されたプロフィールを確認
SELECT 
  up.id,
  up.email,
  up.role,
  up.is_active,
  au.email_confirmed_at
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
ORDER BY up.created_at;