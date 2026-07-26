# workout-backend

Spring Boot backend for the Jasmin Workout App.

## Stack

- Java 21
- Spring Boot 3.4
- Spring Web, Data JPA, Security (OAuth2 Resource Server / Supabase JWT)
- Flyway + PostgreSQL (Supabase)

## Setup

1. Install Java 21 and Maven (or use an IDE with Maven support).
2. Create a Supabase project (Auth + Postgres).
3. Copy `application-local.properties.example` to `application-local.properties` and set:
   - JDBC URL / password for Supabase Postgres
   - `spring.security.oauth2.resourceserver.jwt.issuer-uri=https://YOUR_REF.supabase.co/auth/v1`
4. Run with the local profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Flyway applies `V1` (schema + signup trigger for `profiles` / `user_settings`), `V2` (skill levels + system WODs), and `V3` (demo users / seed data).

See [`src/main/resources/db/migration/README.md`](src/main/resources/db/migration/README.md) for tables and demo credentials.

## API (personal journal)

Authenticated with `Authorization: Bearer <supabase_access_token>`:

| Area | Base path |
|------|-----------|
| Profile | `/api/v1/me` |
| Settings | `/api/v1/settings` |
| WODs | `/api/v1/wods` |
| Exercises / PRs | `/api/v1/exercises` |
| Calendar logs | `/api/v1/activity-logs` |
| Skill | `/api/v1/me/skill`, `/api/v1/skill-levels` |
