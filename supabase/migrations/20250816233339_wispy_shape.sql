/*
  # テスト用ユーザーの作成

  1. 新しいテーブル
    - なし（既存テーブルにデータを追加）

  2. セキュリティ
    - 既存のRLSポリシーを使用

  3. 変更内容
    - テスト用管理者ユーザー（admin@remilabhc.com）を作成
    - テスト用編集者ユーザー（editor@remilabhc.com）を作成
    - 対応するuser_profilesレコードを作成
    - 重複を避けるため、既存チェックを実装
*/

-- テスト用管理者ユーザーのプロフィールを作成（auth.usersは手動作成が必要）
DO $$
DECLARE
  admin_user_id uuid;
  editor_user_id uuid;
BEGIN
  -- 管理者用のUUIDを生成
  admin_user_id := gen_random_uuid();
  
  -- 編集者用のUUIDを生成
  editor_user_id := gen_random_uuid();

  -- 管理者のuser_profileを作成（既存の場合は更新）
  INSERT INTO public.user_profiles (
    id,
    email,
    role,
    permissions,
    is_active
  ) VALUES (
    admin_user_id,
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
    updated_at = NOW();

  -- 編集者のuser_profileを作成（既存の場合は更新）
  INSERT INTO public.user_profiles (
    id,
    email,
    role,
    permissions,
    is_active
  ) VALUES (
    editor_user_id,
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
    updated_at = NOW();

  RAISE NOTICE 'テスト用ユーザープロフィールを作成しました';
  RAISE NOTICE '管理者: admin@remilabhc.com (ID: %)', admin_user_id;
  RAISE NOTICE '編集者: editor@remilabhc.com (ID: %)', editor_user_id;
  RAISE NOTICE '注意: Supabase Authでのユーザー作成は手動で行う必要があります';

END $$;