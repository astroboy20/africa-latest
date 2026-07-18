-- Add email to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Create admin_modules table for admin-uploaded content
CREATE TABLE IF NOT EXISTS public.admin_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  content TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'nigeria',
  era TEXT NOT NULL DEFAULT 'pre-colonial',
  module_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin modules are viewable by everyone"
  ON public.admin_modules FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert modules"
  ON public.admin_modules FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update modules"
  ON public.admin_modules FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete modules"
  ON public.admin_modules FOR DELETE USING (auth.role() = 'authenticated');

CREATE TRIGGER update_admin_modules_updated_at
  BEFORE UPDATE ON public.admin_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
