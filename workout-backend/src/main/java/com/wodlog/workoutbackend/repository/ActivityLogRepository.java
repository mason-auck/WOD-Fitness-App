package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.ActivityLog;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {

  List<ActivityLog> findByUserIdAndLoggedOnBetweenOrderByLoggedOnDescCreatedAtDesc(
      UUID userId, LocalDate from, LocalDate to);

  List<ActivityLog> findByUserIdOrderByLoggedOnDescCreatedAtDesc(UUID userId);

  List<ActivityLog> findByUserIdAndWodIdOrderByLoggedOnDescCreatedAtDesc(UUID userId, UUID wodId);

  Optional<ActivityLog> findByIdAndUserId(UUID id, UUID userId);

  long countByUserIdAndKind(UUID userId, String kind);

  List<ActivityLog> findTop10ByUserIdOrderByLoggedOnDescCreatedAtDesc(UUID userId);
}
