# workout-backend

Spring Boot backend for the Jasmin Workout App.

## Stack

- Java 21
- Spring Boot 3.4
- Spring Web, Data JPA, Security (OAuth2 Resource Server)
- Flyway + PostgreSQL (Supabase)

## Project layout

```
workout-backend/
├── pom.xml
├── src/main/java/com/wodlog/workoutbackend/
│   └── WorkoutBackendApplication.java
└── src/main/resources/
    ├── application.properties
    ├── application-local.properties.example
    └── db/migration/          # Flyway SQL migrations go here
```

## Setup

1. Install Java 21 and Maven (or use an IDE with Maven support).
2. Create a Supabase project and copy the database connection details.
3. Copy `application-local.properties.example` to `application-local.properties` and fill in your credentials.
4. Run with the local profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

## Next steps

- Add Flyway migrations for personal-journal tables
- Configure Supabase JWT validation
- Add controllers/services for WODs, PRs, calendar logs, settings, and skill XP
