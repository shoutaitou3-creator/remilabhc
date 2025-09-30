/*
  # Confirm user email addresses

  1. Email Confirmation
    - Set email_confirmed_at for existing users
    - Enable email confirmation for admin and editor users
  
  2. Security
    - Ensure users can log in immediately
    - Fix authentication flow
*/

-- 既存ユーザーのメール確認状態を強制的に有効にする
UPDATE auth.users 
SET 
  email_confirmed_at = now(),
  updated_at = now()
WHERE email IN ('admin@remilabhc.com', 'editor@remilabhc.com')
  AND email_confirmed_at IS NULL;

-- 確認用クエリ（実行結果を確認）
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users 
WHERE email IN ('admin@remilabhc.com', 'editor@remilabhc.com');