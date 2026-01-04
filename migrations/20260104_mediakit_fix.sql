-- 1. Create media-kit-logos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media-kit-logos', 'media-kit-logos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policies
-- Note: We removed 'ALTER TABLE' as it requires superuser permissions. 
-- RLS is usually enabled by default. If not, these policies might just not enforce, 
-- but usually on Supabase Storage it is enabled.

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Public Access Media Kit" ON storage.objects;
CREATE POLICY "Public Access Media Kit"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media-kit-logos' );

DROP POLICY IF EXISTS "Authenticated Upload Media Kit" ON storage.objects;
CREATE POLICY "Authenticated Upload Media Kit"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media-kit-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Authenticated Delete Media Kit" ON storage.objects;
CREATE POLICY "Authenticated Delete Media Kit"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'media-kit-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Add profileData JSON column to User table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'profileData') THEN
        ALTER TABLE "User" ADD COLUMN "profileData" JSONB;
    END IF;
END $$;
