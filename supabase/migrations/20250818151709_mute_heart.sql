/*
  # 資料ダウンロードシステム

  1. New Tables
    - `resource_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `color` (text)
      - `is_active` (boolean)
      - `display_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `file_name` (text)
      - `file_size` (bigint)
      - `file_url` (text)
      - `file_type` (text)
      - `category_id` (uuid, foreign key)
      - `is_published` (boolean)
      - `download_count` (integer)
      - `display_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `resource_downloads`
      - `id` (uuid, primary key)
      - `resource_id` (uuid, foreign key)
      - `ip_address` (text)
      - `user_agent` (text)
      - `downloaded_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to published resources
    - Add policies for authenticated users to manage resources
    - Add policies for download tracking

  3. Storage
    - Create storage bucket for resource files
    - Set up RLS policies for file access
*/

-- Create resource categories table
CREATE TABLE IF NOT EXISTS resource_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#3b82f6',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  file_name text NOT NULL,
  file_size bigint DEFAULT 0,
  file_url text NOT NULL,
  file_type text NOT NULL,
  category_id uuid REFERENCES resource_categories(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false,
  download_count integer DEFAULT 0,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resource downloads tracking table
CREATE TABLE IF NOT EXISTS resource_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
  ip_address text,
  user_agent text,
  downloaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resource_categories
CREATE POLICY "Anyone can read active categories"
  ON resource_categories
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all categories"
  ON resource_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON resource_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for resources
CREATE POLICY "Anyone can read published resources"
  ON resources
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can read all resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage resources"
  ON resources
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for resource_downloads
CREATE POLICY "Anyone can insert download records"
  ON resource_downloads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read download records"
  ON resource_downloads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resource_categories_active_order ON resource_categories (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_resources_published_order ON resources (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources (category_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource ON resource_downloads (resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_date ON resource_downloads (downloaded_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_resource_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_resource_categories_updated_at
  BEFORE UPDATE ON resource_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_resource_categories_updated_at();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_resources_updated_at();

-- Insert default categories
INSERT INTO resource_categories (name, slug, description, color, display_order) VALUES
  ('概要資料', 'overview', 'コンテストの概要と応募要項', '#3b82f6', 1),
  ('審査員資料', 'judges', '審査員の詳細プロフィール', '#8b5cf6', 2),
  ('賞金資料', 'prizes', '賞金・賞品の詳細情報', '#f59e0b', 3),
  ('その他', 'others', 'その他の資料', '#6b7280', 4)
ON CONFLICT (name) DO NOTHING;

-- Create storage bucket for resource files
INSERT INTO storage.buckets (id, name, public) VALUES ('resource-files', 'resource-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Anyone can view resource files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'resource-files');

CREATE POLICY "Authenticated users can upload resource files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resource-files');

CREATE POLICY "Authenticated users can update resource files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resource-files')
  WITH CHECK (bucket_id = 'resource-files');

CREATE POLICY "Authenticated users can delete resource files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resource-files');