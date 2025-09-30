/*
  # Fix user_profiles trigger function

  1. Issues Fixed
    - Fix trigger function name mismatch
    - Ensure proper trigger function exists
    - Fix any RLS policy issues

  2. Changes
    - Create or replace the correct trigger function
    - Update trigger to use correct function name
    - Add debugging for auth issues
*/

-- まず既存のトリガーを削除
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;

-- 正しいトリガー関数を作成
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを再作成
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- デバッグ用：認証されたユーザーが自分のプロフィールを確実に読み取れるようにする
-- 既存のポリシーを確認して、必要に応じて更新

-- 既存のSELECTポリシーを削除して再作成
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;

-- より明確なSELECTポリシーを作成
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 管理者用のポリシーも確認
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON user_profiles;

CREATE POLICY "Admins can manage all user profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- last_login更新用のポリシーも確認
DROP POLICY IF EXISTS "Users can update own last_login" ON user_profiles;

CREATE POLICY "Users can update own last_login"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);