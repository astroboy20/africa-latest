-- Add questions JSON column to admin_modules
ALTER TABLE public.admin_modules ADD COLUMN IF NOT EXISTS questions JSONB;
