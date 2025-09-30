-- auth.users テーブルのRLSポリシーを設定
-- 認証済みユーザーが自分の情報を読み取れるようにする

-- 既存のポリシーを削除（重複エラーを避けるため）
DROP POLICY IF EXISTS "Users can view own user data" ON auth.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON auth.users;

-- 認証済みユーザーが自分のユーザー情報を読み取れるポリシーを作成
CREATE POLICY "Users can view own user data" ON auth.users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- サービスロールによる管理アクセスを許可（管理機能用）
CREATE POLICY "Service role can manage users" ON auth.users
  FOR ALL TO service_role
  USING (true);