/*
  # 資料テーブルにアイコンフィールドを追加

  1. テーブル変更
    - `resources` テーブルに `icon_url` カラムを追加
    - アイコン画像のURLを保存するためのフィールド

  2. セキュリティ
    - 既存のRLSポリシーがそのまま適用される
    - 新しいカラムに対する特別な制限は不要
*/

-- resources テーブルにアイコンURLカラムを追加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resources' AND column_name = 'icon_url'
  ) THEN
    ALTER TABLE resources ADD COLUMN icon_url text DEFAULT '';
  END IF;
END $$;

-- インデックスを追加（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_resources_icon_url ON resources(icon_url) WHERE icon_url != '';