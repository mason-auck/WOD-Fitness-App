-- V3: Seed demo users + data mirroring workout-app mocks
-- Demo login emails use password: password123

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Stable IDs
-- Users: Jasmin, Mike T., Sarah K., Coach Dan, Alex R.
-- Gym, exercises, posts, etc.

-- Temporarily disable signup trigger so we control profile inserts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public._seed_auth_user(
  p_id UUID,
  p_email TEXT,
  p_display_name TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = p_id) THEN
    RETURN;
  END IF;

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    p_id,
    'authenticated',
    'authenticated',
    p_email,
    extensions.crypt('password123', extensions.gen_salt('bf'::text)),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('display_name', p_display_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    p_id,
    p_id,
    jsonb_build_object('sub', p_id::text, 'email', p_email),
    'email',
    p_id::text,
    now(),
    now(),
    now()
  );
END;
$$;

SELECT public._seed_auth_user(
  'a0000000-0000-4000-8000-000000000001',
  'jasmin@wodlog.demo',
  'Jasmin'
);
SELECT public._seed_auth_user(
  'a0000000-0000-4000-8000-000000000002',
  'mike@wodlog.demo',
  'Mike T.'
);
SELECT public._seed_auth_user(
  'a0000000-0000-4000-8000-000000000003',
  'sarah@wodlog.demo',
  'Sarah K.'
);
SELECT public._seed_auth_user(
  'a0000000-0000-4000-8000-000000000004',
  'coach.dan@wodlog.demo',
  'Coach Dan'
);
SELECT public._seed_auth_user(
  'a0000000-0000-4000-8000-000000000005',
  'alex@wodlog.demo',
  'Alex R.'
);

INSERT INTO profiles (id, username, display_name) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'jasmin', 'Jasmin'),
  ('a0000000-0000-4000-8000-000000000002', 'mike_t', 'Mike T.'),
  ('a0000000-0000-4000-8000-000000000003', 'sarah_k', 'Sarah K.'),
  ('a0000000-0000-4000-8000-000000000004', 'coach_dan', 'Coach Dan'),
  ('a0000000-0000-4000-8000-000000000005', 'alex_r', 'Alex R.')
ON CONFLICT (id) DO UPDATE
SET display_name = EXCLUDED.display_name,
    username = EXCLUDED.username;

INSERT INTO user_settings (user_id, unit_system, keep_screen_on) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'imperial', false),
  ('a0000000-0000-4000-8000-000000000002', 'imperial', false),
  ('a0000000-0000-4000-8000-000000000003', 'imperial', false),
  ('a0000000-0000-4000-8000-000000000004', 'imperial', false),
  ('a0000000-0000-4000-8000-000000000005', 'imperial', false)
ON CONFLICT (user_id) DO NOTHING;

-- Re-enable signup trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Gym + memberships
INSERT INTO gyms (id, name) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'WOD Log Box');

INSERT INTO gym_members (gym_id, user_id, role) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'member'),
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'member'),
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003', 'member'),
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000004', 'coach'),
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000005', 'member');

-- Jasmin favorites (Fran + Cindy), matching WODs screen seed
INSERT INTO user_wod_favorites (user_id, wod_id) VALUES
  ('a0000000-0000-4000-8000-000000000001', '11111111-1111-1111-1111-111111111101'),
  ('a0000000-0000-4000-8000-000000000001', '11111111-1111-1111-1111-111111111104');

-- Jasmin exercises (Personal Records page)
INSERT INTO exercises (id, user_id, name, category) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Bench Press', 'Weightlifting'),
  ('c0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Back Squat', 'Weightlifting'),
  ('c0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Deadlift', 'Weightlifting'),
  ('c0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', '1 Mile Run', 'Cardio'),
  ('c0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', '1000 Meter Row', 'Cardio'),
  ('c0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000001', 'Snatch', 'Weightlifting'),
  ('c0000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000001', 'Clean & Jerk', 'Weightlifting'),
  ('c0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000001', 'Strict Pull-ups', 'Gymnastics'),
  ('c0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000001', 'Muscle-ups', 'Gymnastics'),
  ('c0000000-0000-4000-8000-00000000000a', 'a0000000-0000-4000-8000-000000000001', 'Fran', 'Benchmarks'),
  ('c0000000-0000-4000-8000-00000000000b', 'a0000000-0000-4000-8000-000000000001', 'Murph', 'Benchmarks');

INSERT INTO pr_entries (id, exercise_id, user_id, value, logged_on, notes) VALUES
  ('d0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', '175 lbs', '2026-04-10', NULL),
  ('d0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', '185 lbs', '2026-05-22', NULL),
  ('d0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', '225 lbs', '2026-06-06', 'New 1RM — depth was solid.'),
  ('d0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', '315 lbs', '2026-05-15', NULL),
  ('d0000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', '6:42', '2026-05-01', NULL),
  ('d0000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', '3:48', '2026-04-18', NULL),
  ('d0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000001', '135 lbs', '2026-03-20', NULL),
  ('d0000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000001', '185 lbs', '2026-03-20', NULL),
  ('d0000000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000001', '15 reps', '2026-06-01', NULL),
  ('d0000000-0000-4000-8000-00000000000a', 'c0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000001', '8 reps', '2026-05-10', NULL),
  ('d0000000-0000-4000-8000-00000000000b', 'c0000000-0000-4000-8000-00000000000a', 'a0000000-0000-4000-8000-000000000001', '4:32', '2026-06-08', NULL),
  ('d0000000-0000-4000-8000-00000000000c', 'c0000000-0000-4000-8000-00000000000b', 'a0000000-0000-4000-8000-000000000001', '42:10', '2026-06-03', NULL);

-- Calendar logs (fixed Back Squat -> exercise 2)
INSERT INTO activity_logs (id, user_id, kind, logged_on, wod_id, exercise_id, title, wod_type, result, notes) VALUES
  (
    'e0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000001',
    'wod',
    '2026-06-08',
    '11111111-1111-1111-1111-111111111101',
    NULL,
    'Fran',
    'For Time',
    '4:32',
    'Felt strong on pull-ups.'
  ),
  (
    'e0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000001',
    'pr',
    '2026-06-06',
    NULL,
    'c0000000-0000-4000-8000-000000000002',
    'Back Squat',
    NULL,
    '225 lbs',
    'New 1RM — depth was solid.'
  ),
  (
    'e0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000001',
    'wod',
    '2026-06-03',
    '11111111-1111-1111-1111-111111111105',
    NULL,
    'Murph',
    'For Time',
    '42:10',
    NULL
  ),
  (
    'e0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000001',
    'wod',
    '2026-06-01',
    '11111111-1111-1111-1111-111111111104',
    NULL,
    'Cindy',
    'AMRAP',
    '18 rounds + 4',
    NULL
  );

-- XP: 3 WOD calendar logs * 40 + 12 PR entries * 45
INSERT INTO xp_events (user_id, source, source_id, xp)
SELECT
  'a0000000-0000-4000-8000-000000000001',
  'wod_log',
  id,
  40
FROM activity_logs
WHERE user_id = 'a0000000-0000-4000-8000-000000000001' AND kind = 'wod';

INSERT INTO xp_events (user_id, source, source_id, xp)
SELECT
  'a0000000-0000-4000-8000-000000000001',
  'pr_log',
  id,
  45
FROM pr_entries
WHERE user_id = 'a0000000-0000-4000-8000-000000000001';

-- Whiteboard posts matching INITIAL_ENTRIES
INSERT INTO whiteboard_posts (
  id, author_id, wod_id, wod_title, wod_type, score, notes, caption,
  visibility, gym_id, created_at
) VALUES
  (
    'f0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000001',
    '11111111-1111-1111-1111-111111111101',
    'Fran',
    'For Time',
    '4:32',
    NULL,
    'Finally sub-5! Thrusters felt heavy today.',
    'gym',
    'b0000000-0000-4000-8000-000000000001',
    now() - interval '2 hours'
  ),
  (
    'f0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000002',
    '11111111-1111-1111-1111-111111111102',
    '1RM Back Squat',
    'Weight',
    '315 lbs',
    'Felt solid, maybe 320 next time.',
    NULL,
    'gym',
    'b0000000-0000-4000-8000-000000000001',
    now() - interval '4 hours'
  ),
  (
    'f0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000003',
    '11111111-1111-1111-1111-111111111104',
    'Cindy',
    'AMRAP',
    '19 rounds + 7',
    NULL,
    'Arms were on fire by round 12.',
    'public',
    NULL,
    now() - interval '1 day'
  ),
  (
    'f0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000004',
    '11111111-1111-1111-1111-111111111105',
    'Murph',
    'For Time',
    '38:44 (vest)',
    'Partitioned 20 rounds of Cindy-style. Hot out there.',
    NULL,
    'public',
    NULL,
    now() - interval '1 day' - interval '1 hour'
  ),
  (
    'f0000000-0000-4000-8000-000000000005',
    'a0000000-0000-4000-8000-000000000005',
    NULL,
    'Grace',
    'For Time',
    '3:58',
    NULL,
    NULL,
    'gym',
    'b0000000-0000-4000-8000-000000000001',
    now() - interval '2 days'
  ),
  (
    'f0000000-0000-4000-8000-000000000006',
    'a0000000-0000-4000-8000-000000000001',
    '11111111-1111-1111-1111-111111111107',
    'Today''s RSS WOD',
    'AMRAP',
    '11 rounds + 4',
    'Toes-to-bar broke down after round 8.',
    'Good sweat before work.',
    'gym',
    'b0000000-0000-4000-8000-000000000001',
    now() - interval '3 days'
  );

-- Comments
INSERT INTO whiteboard_comments (id, post_id, author_id, body, created_at) VALUES
  ('f1000000-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'Huge PR — nice work!', now() - interval '1 hour'),
  ('f1000000-0000-4000-8000-000000000002', 'f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003', 'Beast mode', now() - interval '45 minutes'),
  ('f1000000-0000-4000-8000-000000000003', 'f0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000004', 'Depth looked great on every rep.', now() - interval '3 hours'),
  ('f1000000-0000-4000-8000-000000000004', 'f0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'Inspiring — need to tackle this again soon.', now() - interval '1 day'),
  ('f1000000-0000-4000-8000-000000000005', 'f0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000002', 'Sub-4 club!', now() - interval '2 days');

-- Likes (subset that includes Jasmin likedByMe on posts 1 and 4)
INSERT INTO whiteboard_likes (post_id, user_id) VALUES
  ('f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001'),
  ('f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002'),
  ('f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003'),
  ('f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000004'),
  ('f0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000003'),
  ('f0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000004'),
  ('f0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001'),
  ('f0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000002'),
  ('f0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000005'),
  ('f0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001'),
  ('f0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000002'),
  ('f0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000003'),
  ('f0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000005'),
  ('f0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000002'),
  ('f0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000002'),
  ('f0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000003');

DROP FUNCTION IF EXISTS public._seed_auth_user(UUID, TEXT, TEXT);
