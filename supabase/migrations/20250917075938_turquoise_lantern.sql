/*
  # エントリー作品管理テーブル作成

  1. 新しいテーブル
    - `entry_works`
      - `id` (uuid, primary key)
      - `title` (text) - 作品タイトル
      - `description` (text) - 作品説明
      - `image_url` (text) - 作品画像URL
      - `instagram_url` (text) - Instagram投稿URL
      - `instagram_account` (text) - Instagramアカウント名
      - `department` (text) - 部門（creative/reality）
      - `hashtag` (text) - 使用ハッシュタグ
      - `period` (text) - 開催期（第1期、第2期、第3期）
      - `is_nominated` (boolean) - ノミネート状態
      - `is_published` (boolean) - 公開状態
      - `display_order` (integer) - 表示順序
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. セキュリティ
    - Enable RLS on `entry_works` table
    - Add policies for public read access and authenticated user management
*/

CREATE TABLE IF NOT EXISTS entry_works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  instagram_account text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT 'creative',
  hashtag text NOT NULL DEFAULT '',
  period text NOT NULL DEFAULT '第1期',
  is_nominated boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT entry_works_department_check CHECK (department IN ('creative', 'reality')),
  CONSTRAINT entry_works_period_check CHECK (period IN ('第1期', '第2期', '第3期'))
);

-- Enable RLS
ALTER TABLE entry_works ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Anyone can read published entry works"
  ON entry_works
  FOR SELECT
  TO public
  USING (is_published = true);

-- Policies for authenticated users (admin/editor management)
CREATE POLICY "Authenticated users can read all entry works"
  ON entry_works
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert entry works"
  ON entry_works
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update entry works"
  ON entry_works
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete entry works"
  ON entry_works
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_entry_works_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_entry_works_updated_at
  BEFORE UPDATE ON entry_works
  FOR EACH ROW
  EXECUTE FUNCTION update_entry_works_updated_at();

-- Insert sample data (5 nominated, 5 non-nominated)
INSERT INTO entry_works (title, description, image_url, instagram_url, instagram_account, department, hashtag, period, is_nominated, is_published, display_order) VALUES
-- ノミネート作品（5件）
('エレガントなアップスタイル', '上品で洗練されたバックスタイルを表現しました。', 'https://images.pexels.com/photos/3992883/pexels-photo-3992883.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample1/', '@stylist_takeshi', 'creative', '#レミラバックスタイルC', '第1期', true, true, 1),
('ナチュラルウェーブスタイル', 'お客様の髪質を活かした自然なウェーブで後ろ姿を美しく。', 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample2/', '@hair_artist_yuki', 'reality', '#レミラバックスタイルR', '第1期', true, true, 2),
('モダンボブスタイル', '現代的なカットラインで作る美しいバックシルエット。', 'https://images.pexels.com/photos/3992660/pexels-photo-3992660.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample3/', '@salon_mirai', 'creative', '#レミラバックスタイルC', '第1期', true, true, 3),
('カラーグラデーション', '美しいグラデーションカラーでバックスタイルに深みを。', 'https://images.pexels.com/photos/3992675/pexels-photo-3992675.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample4/', '@color_master_ai', 'creative', '#レミラバックスタイルC', '第1期', true, true, 4),
('ボリュームアップスタイル', 'ボリュームが気になるお客様の悩みを解決したスタイル。', 'https://images.pexels.com/photos/3992882/pexels-photo-3992882.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample5/', '@volume_specialist', 'reality', '#レミラバックスタイルR', '第1期', true, true, 5),

-- 非ノミネート作品（5件）
('アシンメトリーカット', '左右非対称のカットで個性的なバックスタイルを演出。', 'https://images.pexels.com/photos/3992884/pexels-photo-3992884.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample6/', '@asymmetry_pro', 'creative', '#レミラバックスタイルC', '第1期', false, true, 6),
('ダメージケアスタイル', 'ダメージヘアを美しく見せるカットとトリートメント。', 'https://images.pexels.com/photos/3992885/pexels-photo-3992885.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample7/', '@damage_care_salon', 'reality', '#レミラバックスタイルR', '第1期', false, true, 7),
('レイヤードスタイル', '多層的なレイヤーで動きのあるバックスタイル。', 'https://images.pexels.com/photos/3992886/pexels-photo-3992886.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample8/', '@layer_master', 'creative', '#レミラバックスタイルC', '第1期', false, true, 8),
('エイジングケアスタイル', '年齢による髪の変化に対応した美しいスタイル。', 'https://images.pexels.com/photos/3992887/pexels-photo-3992887.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample9/', '@aging_care_expert', 'reality', '#レミラバックスタイルR', '第1期', false, true, 9),
('アバンギャルドスタイル', '前衛的なデザインで表現する革新的なバックスタイル。', 'https://images.pexels.com/photos/3992888/pexels-photo-3992888.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://www.instagram.com/p/sample10/', '@avant_garde_hair', 'creative', '#レミラバックスタイルC', '第1期', false, true, 10);