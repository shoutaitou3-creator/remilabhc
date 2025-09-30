/*
  # 遷移先設定テーブルの作成

  1. New Tables
    - `redirect_settings`
      - `id` (uuid, primary key)
      - `site_slug` (text, unique)
      - `redirect_url` (text)
      - `redirect_delay` (integer)
      - `show_completion_message` (boolean)
      - `enable_auto_redirect` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `redirect_settings` table
    - Add policy for public read access
    - Add policy for authenticated users to manage settings
*/

CREATE TABLE IF NOT EXISTS redirect_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_slug text UNIQUE NOT NULL,
  redirect_url text NOT NULL DEFAULT 'https://remila.jp/',
  redirect_delay integer NOT NULL DEFAULT 1000,
  show_completion_message boolean NOT NULL DEFAULT true,
  enable_auto_redirect boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE redirect_settings ENABLE ROW LEVEL SECURITY;

-- 公開ユーザーが設定を読み取り可能
CREATE POLICY "Anyone can read redirect settings"
  ON redirect_settings
  FOR SELECT
  TO public
  USING (true);

-- 認証済みユーザーが設定を管理可能
CREATE POLICY "Authenticated users can insert redirect settings"
  ON redirect_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update redirect settings"
  ON redirect_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete redirect settings"
  ON redirect_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- updated_at自動更新のトリガー関数
CREATE OR REPLACE FUNCTION update_redirect_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at自動更新のトリガー
CREATE TRIGGER update_redirect_settings_updated_at
  BEFORE UPDATE ON redirect_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_redirect_settings_updated_at();

-- デフォルト設定を挿入
INSERT INTO redirect_settings (site_slug, redirect_url, redirect_delay, show_completion_message, enable_auto_redirect)
VALUES ('remila-bhc', 'https://remila.jp/', 1000, true, true)
ON CONFLICT (site_slug) DO NOTHING;