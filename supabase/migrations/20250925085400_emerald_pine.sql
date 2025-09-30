/*
  # Create entry-works-images storage bucket

  1. Storage Bucket
    - Create `entry-works-images` bucket for storing entry work images
    - Set as public bucket for easy access to images
    - Configure appropriate file size and type restrictions

  2. Security Policies
    - Allow public read access to all images
    - Allow authenticated users to upload images
    - Allow authenticated users to update/delete their uploaded images

  3. File Management
    - Support common image formats (jpg, jpeg, png, webp, gif)
    - Set reasonable file size limits
*/

-- Create the entry-works-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'entry-works-images',
  'entry-works-images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all images in the bucket
CREATE POLICY "Public read access for entry work images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'entry-works-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload entry work images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'entry-works-images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update entry work images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'entry-works-images')
  WITH CHECK (bucket_id = 'entry-works-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete entry work images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'entry-works-images');