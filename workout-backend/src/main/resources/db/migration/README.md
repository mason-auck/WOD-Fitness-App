# Database migrations (Flyway)

These migrations create a schema that mirrors the Expo app in `workout-app/`.

| Version | File | Purpose |
|---------|------|---------|
| V1 | `V1__init_schema.sql` | All tables + signup trigger |
| V2 | `V2__seed_catalog.sql` | Skill levels + system WODs |
| V3 | `V3__seed_demo_app_data.sql` | Demo users, gym, PRs, calendar, whiteboard |

## Frontend → tables

| App screen / feature | Tables |
|----------------------|--------|
| Profile | `profiles` (stats derived from logs) |
| Settings | `user_settings` (`unit_system`, `keep_screen_on`) |
| Skill Level | `skill_levels` + `xp_events` |
| WODs | `wods`, `user_wod_favorites` |
| Personal Records | `exercises`, `pr_entries` |
| Calendar | `activity_logs` |
| Whiteboard | `gyms`, `gym_members`, `whiteboard_posts`, `whiteboard_likes`, `whiteboard_comments` |
| Timer | not persisted (session-only) |

## Demo users (V3)

| Display name | Email | Password |
|--------------|-------|----------|
| Jasmin | `jasmin@wodlog.demo` | `password123` |
| Mike T. | `mike@wodlog.demo` | `password123` |
| Sarah K. | `sarah@wodlog.demo` | `password123` |
| Coach Dan | `coach.dan@wodlog.demo` | `password123` |
| Alex R. | `alex@wodlog.demo` | `password123` |

## Apply

1. Set DB credentials in `application-local.properties`
2. Run with profile `local`
3. Confirm tables in Supabase Table Editor / `flyway_schema_history`

### If you see "Migration checksum mismatch"

You previously applied an older V1/V2, then the migration files were replaced. Flyway refuses to continue.

**Fix (dev databases only):**

1. Open Supabase → **SQL Editor**
2. Run [`scripts/reset_dev_schema.sql`](../../scripts/reset_dev_schema.sql)
3. Restart Spring Boot with the `local` profile

That clears `flyway_schema_history` and app tables, then Flyway applies V1 → V2 → V3 fresh.

If V3 fails on `auth.users` / `auth.identities` (Supabase schema differences), V1+V2 still give you the full schema; seed users can be created in the Auth UI instead.
