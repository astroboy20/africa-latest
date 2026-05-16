
-- Create profiles table for trivia players
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(username)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (true);

-- Completed sets table
CREATE TABLE public.completed_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  set_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  perfect BOOLEAN NOT NULL DEFAULT false,
  points INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id, set_id)
);

ALTER TABLE public.completed_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Completed sets are viewable by everyone"
  ON public.completed_sets FOR SELECT USING (true);

CREATE POLICY "Anyone can insert completed sets"
  ON public.completed_sets FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update completed sets"
  ON public.completed_sets FOR UPDATE USING (true);

-- Earned badges table
CREATE TABLE public.earned_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id, badge_id)
);

ALTER TABLE public.earned_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Earned badges are viewable by everyone"
  ON public.earned_badges FOR SELECT USING (true);

CREATE POLICY "Anyone can insert earned badges"
  ON public.earned_badges FOR INSERT WITH CHECK (true);

-- Modules read table
CREATE TABLE public.modules_read (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id, module_id)
);

ALTER TABLE public.modules_read ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules read are viewable by everyone"
  ON public.modules_read FOR SELECT USING (true);

CREATE POLICY "Anyone can insert modules read"
  ON public.modules_read FOR INSERT WITH CHECK (true);

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  p.id,
  p.username,
  p.total_points,
  p.best_streak,
  COUNT(DISTINCT cs.set_id) as sets_completed,
  COUNT(DISTINCT eb.badge_id) as badges_earned
FROM public.profiles p
LEFT JOIN public.completed_sets cs ON cs.profile_id = p.id
LEFT JOIN public.earned_badges eb ON eb.profile_id = p.id
GROUP BY p.id, p.username, p.total_points, p.best_streak
ORDER BY p.total_points DESC;

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for leaderboard queries
CREATE INDEX idx_profiles_total_points ON public.profiles(total_points DESC);
CREATE INDEX idx_completed_sets_profile ON public.completed_sets(profile_id);
CREATE INDEX idx_earned_badges_profile ON public.earned_badges(profile_id);
