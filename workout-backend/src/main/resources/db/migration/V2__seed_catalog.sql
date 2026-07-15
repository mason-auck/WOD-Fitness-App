-- V2: Seed catalog data (skill ladder + system WODs matching frontend)

INSERT INTO skill_levels (level, title, xp_required) VALUES
  (1, 'Beginner', 0),
  (2, 'Novice', 100),
  (3, 'Intermediate', 400),
  (4, 'Advanced', 750),
  (5, 'Elite', 1200);

INSERT INTO wods (id, title, description, type, category, source, created_by)
VALUES
  (
    '11111111-1111-1111-1111-111111111101',
    'Fran',
    '21-15-9 reps for time of thrusters (95/65 lb) and pull-ups. Post total time to complete all reps.',
    'For Time',
    'The Girls',
    'system',
    NULL
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    '1RM Back Squat',
    'Work up to a 1-rep max back squat. Warm up thoroughly, then add weight each attempt until you hit your max.',
    'Weight',
    'Benchmarks',
    'system',
    NULL
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    'Karen',
    '150 wall-ball shots (20/14 lb) for time. Post total reps completed and time if capped.',
    'Reps & Time',
    'The Girls',
    'system',
    NULL
  ),
  (
    '11111111-1111-1111-1111-111111111104',
    'Cindy',
    '20-minute AMRAP of 5 pull-ups, 10 push-ups, and 15 air squats. Score is total rounds plus reps.',
    'AMRAP',
    'The Girls',
    'system',
    NULL
  ),
  (
    '11111111-1111-1111-1111-111111111105',
    'Murph',
    '1 mile run, 100 pull-ups, 200 push-ups, 300 air squats, 1 mile run. Partition reps as needed.',
    'For Time',
    'Heroes',
    'system',
    NULL
  ),
  (
    '11111111-1111-1111-1111-111111111106',
    'Annie',
    '50-40-30-20-10 reps for time of double-unders and sit-ups.',
    'For Time',
    'The Girls',
    'system',
    NULL
  ),
  (
    '11111111-1111-1111-1111-111111111107',
    'Today''s RSS WOD',
    'Synced from RSS feed: 12-minute AMRAP of 10 toes-to-bar and 10 dumbbell snatches (50/35 lb).',
    'AMRAP',
    'RSS WODs',
    'system',
    NULL
  ),
  (
    '11111111-1111-1111-1111-111111111108',
    '26.1',
    'CrossFit Open workout from the current season. Check the Open page for official standards and scoring.',
    'For Time',
    'Open WODs',
    'system',
    NULL
  ),
  (
    '11111111-1111-1111-1111-111111111109',
    '100 Burpees for Time',
    '100 burpees for time. No equipment required — post your total time to complete all reps.',
    'For Time',
    'Bodyweight',
    'system',
    NULL
  ),
  (
    '11111111-1111-1111-1111-111111111110',
    'Partner Chipper',
    'With a partner, alternate movements: 50 cal row, 40 box jumps, 30 KB swings, 20 burpees, 10 cleans. Split work any way.',
    'Custom',
    'Custom',
    'system',
    NULL
  );
