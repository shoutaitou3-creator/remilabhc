/*
  # テストユーザーのプロフィール確実作成

  1. 既存のテストユーザープロフィールを確認・作成
  2. 認証との連携を確実にする
  3. デバッグ用の情報も追加

  注意: Supabase Authでのユーザー作成は手動で行う必要があります
*/

-- テスト用管理者プロフィールを確実に作成
INSERT INTO public.user_profiles (
  id,
  email,
  role,
  permissions,
  is_active
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@remilabhc.com',
  'admin',
  '{
    "faq": true,
    "kpi": true,
    "news": true,
    "judges": true,
    "prizes": true,
    "settings": true,
    "sponsors": true,
    "dashboard": true,
    "workExamples": true
  }'::jsonb,
  true
) ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- テスト用編集者プロフィールを確実に作成
INSERT INTO public.user_profiles (
  id,
  email,
  role,
  permissions,
  is_active
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'editor@remilabhc.com',
  'editor',
  '{
    "faq": true,
    "kpi": false,
    "news": true,
    "judges": false,
    "prizes": false,
    "settings": false,
    "sponsors": false,
    "dashboard": true,
    "workExamples": true
  }'::jsonb,
  true
) ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- デバッグ用: 現在のuser_profilesの状況を確認するためのコメント
-- SELECT email, role, is_active FROM public.user_profiles WHERE email IN ('admin@remilabhc.com', 'editor@remilabhc.com');