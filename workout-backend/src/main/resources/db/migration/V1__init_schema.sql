-- V1: Full schema matching workout-app frontend
-- (profile, settings, wods, exercises/PRs, calendar, skill XP, gyms, whiteboard)
-- Timer config/session state is ephemeral and is NOT stored.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- user_settings (matches Settings screen)
-- ---------------------------------------------------------------------------
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles (id) ON DELETE CASCADE,
  unit_system TEXT NOT NULL DEFAULT 'imperial'
    CHECK (unit_system IN ('imperial', 'metric')),
  keep_screen_on BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- skill_levels (lookup matching Skill Level page ladder)
-- ---------------------------------------------------------------------------
CREATE TABLE skill_levels (
  level INTEGER PRIMARY KEY CHECK (level BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  xp_required INTEGER NOT NULL CHECK (xp_required >= 0)
);

-- ---------------------------------------------------------------------------
-- wods
-- ---------------------------------------------------------------------------
CREATE TABLE wods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL
    CHECK (type IN ('For Time', 'Weight', 'Reps & Time', 'AMRAP', 'Custom')),
  category TEXT NOT NULL
    CHECK (category IN (
      'RSS WODs', 'Open WODs', 'The Girls', 'Heroes',
      'Benchmarks', 'Bodyweight', 'Custom'
    )),
  source TEXT NOT NULL
    CHECK (source IN ('system', 'rss', 'user')),
  created_by UUID REFERENCES profiles (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT wods_user_source_requires_creator
    CHECK (
      (source = 'user' AND created_by IS NOT NULL)
      OR (source IN ('system', 'rss'))
    )
);

CREATE INDEX idx_wods_source ON wods (source);
CREATE INDEX idx_wods_created_by ON wods (created_by);

-- ---------------------------------------------------------------------------
-- user_wod_favorites (per-user favorite flag from WODs screen)
-- ---------------------------------------------------------------------------
CREATE TABLE user_wod_favorites (
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  wod_id UUID NOT NULL REFERENCES wods (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, wod_id)
);

CREATE INDEX idx_user_wod_favorites_wod_id ON user_wod_favorites (wod_id);

-- ---------------------------------------------------------------------------
-- exercises (Personal Records list)
-- ---------------------------------------------------------------------------
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT exercises_user_name_unique UNIQUE (user_id, name)
);

CREATE INDEX idx_exercises_user_id ON exercises (user_id);

-- ---------------------------------------------------------------------------
-- pr_entries (exercise detail history)
-- ---------------------------------------------------------------------------
CREATE TABLE pr_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  logged_on DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pr_entries_user_id ON pr_entries (user_id);
CREATE INDEX idx_pr_entries_exercise_id ON pr_entries (exercise_id);
CREATE INDEX idx_pr_entries_exercise_logged_on ON pr_entries (exercise_id, logged_on DESC);

-- ---------------------------------------------------------------------------
-- activity_logs (Calendar page: Log WOD / Log PR)
-- ---------------------------------------------------------------------------
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('wod', 'pr')),
  logged_on DATE NOT NULL,
  wod_id UUID REFERENCES wods (id) ON DELETE SET NULL,
  exercise_id UUID REFERENCES exercises (id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  wod_type TEXT,
  result TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT activity_logs_kind_refs CHECK (
    (kind = 'wod' AND wod_id IS NOT NULL)
    OR (kind = 'pr' AND exercise_id IS NOT NULL)
  )
);

CREATE INDEX idx_activity_logs_user_logged_on ON activity_logs (user_id, logged_on DESC);
CREATE INDEX idx_activity_logs_wod_id ON activity_logs (wod_id);
CREATE INDEX idx_activity_logs_exercise_id ON activity_logs (exercise_id);

-- ---------------------------------------------------------------------------
-- xp_events (Skill Level XP awards)
-- ---------------------------------------------------------------------------
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('wod_log', 'pr_log')),
  source_id UUID NOT NULL,
  xp INTEGER NOT NULL CHECK (xp > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT xp_events_source_unique UNIQUE (source, source_id)
);

CREATE INDEX idx_xp_events_user_id ON xp_events (user_id);

-- ---------------------------------------------------------------------------
-- gyms + memberships (whiteboard visibility = gym)
-- ---------------------------------------------------------------------------
CREATE TABLE gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE gym_members (
  gym_id UUID NOT NULL REFERENCES gyms (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('member', 'coach', 'admin')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (gym_id, user_id)
);

CREATE INDEX idx_gym_members_user_id ON gym_members (user_id);

-- ---------------------------------------------------------------------------
-- whiteboard (social feed)
-- ---------------------------------------------------------------------------
CREATE TABLE whiteboard_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  wod_id UUID REFERENCES wods (id) ON DELETE SET NULL,
  wod_title TEXT NOT NULL,
  wod_type TEXT NOT NULL,
  score TEXT NOT NULL,
  notes TEXT,
  caption TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'gym')),
  gym_id UUID REFERENCES gyms (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT whiteboard_posts_gym_visibility CHECK (
    (visibility = 'public' AND gym_id IS NULL)
    OR (visibility = 'gym' AND gym_id IS NOT NULL)
  )
);

CREATE INDEX idx_whiteboard_posts_author_id ON whiteboard_posts (author_id);
CREATE INDEX idx_whiteboard_posts_created_at ON whiteboard_posts (created_at DESC);
CREATE INDEX idx_whiteboard_posts_gym_id ON whiteboard_posts (gym_id);

CREATE TABLE whiteboard_likes (
  post_id UUID NOT NULL REFERENCES whiteboard_posts (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX idx_whiteboard_likes_user_id ON whiteboard_likes (user_id);

CREATE TABLE whiteboard_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES whiteboard_posts (id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_whiteboard_comments_post_id ON whiteboard_comments (post_id);

-- ---------------------------------------------------------------------------
-- Signup trigger: new auth.users → profiles + user_settings
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  base_username := COALESCE(
    NULLIF(split_part(NEW.email, '@', 1), ''),
    'athlete'
  );
  final_username := base_username || '_' || substr(REPLACE(NEW.id::text, '-', ''), 1, 8);

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', base_username)
  );

  INSERT INTO public.user_settings (user_id, unit_system, keep_screen_on)
  VALUES (NEW.id, 'imperial', false);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
