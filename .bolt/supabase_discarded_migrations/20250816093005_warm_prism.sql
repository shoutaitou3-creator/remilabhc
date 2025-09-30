/*
  # Fix duplicate user profiles

  1. Problem
    - Duplicate user_profiles records causing 422 errors
    - Multiple records with same email address
    - Cannot coerce result to single JSON object

  2. Solution
    - Remove duplicate records
    - Keep only the records that match auth.users
    - Ensure data consistency
*/

-- 重複したuser_profilesレコードを削除し、auth.usersと一致するもののみを残す

-- まず、現在の状況を確認
SELECT 
  up.id,
  up.email,
  up.role,
  au.id as auth_user_id,
  au.email as auth_email
FROM user_profiles up
LEFT JOIN auth.users au ON up.id = au.id
ORDER BY up.email;

-- auth.usersに存在しないuser_profilesレコードを削除
DELETE FROM user_profiles 
WHERE id NOT IN (
  SELECT id FROM auth.users
);

-- 同じメールアドレスで複数のレコードがある場合、最新のもの以外を削除
WITH ranked_profiles AS (
  SELECT 
    id,
    email,
    ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
  FROM user_profiles
)
DELETE FROM user_profiles 
WHERE id IN (
  SELECT id FROM ranked_profiles WHERE rn > 1
);

-- 結果を確認
SELECT 
  up.id,
  up.email,
  up.role,
  up.is_active,
  au.email_confirmed_at
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
ORDER BY up.email;