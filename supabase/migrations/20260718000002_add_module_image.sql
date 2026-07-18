-- Add image_url to admin_modules
ALTER TABLE public.admin_modules ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for module images
INSERT INTO storage.buckets (id, name, public)
VALUES ('module-images', 'module-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of module images
CREATE POLICY "Module images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'module-images');

-- Allow authenticated users to upload module images
CREATE POLICY "Authenticated users can upload module images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'module-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update module images
CREATE POLICY "Authenticated users can update module images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'module-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete module images
CREATE POLICY "Authenticated users can delete module images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'module-images' AND auth.role() = 'authenticated');
