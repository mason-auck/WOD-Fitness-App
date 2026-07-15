-- DEV ONLY: Reset Flyway + app tables so migrations can re-run from scratch.
-- Run this in Supabase → SQL Editor, then restart Spring Boot.
-- Does NOT delete auth.users (your login accounts stay).

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public._seed_auth_user(UUID, TEXT, TEXT);

DROP TABLE IF EXISTS public.flyway_schema_history CASCADE;

DROP TABLE IF EXISTS public.whiteboard_comments CASCADE;
DROP TABLE IF EXISTS public.whiteboard_likes CASCADE;
DROP TABLE IF EXISTS public.whiteboard_posts CASCADE;
DROP TABLE IF EXISTS public.gym_members CASCADE;
DROP TABLE IF EXISTS public.gyms CASCADE;
DROP TABLE IF EXISTS public.xp_events CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.pr_entries CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.user_wod_favorites CASCADE;
DROP TABLE IF EXISTS public.wods CASCADE;
DROP TABLE IF EXISTS public.skill_levels CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
