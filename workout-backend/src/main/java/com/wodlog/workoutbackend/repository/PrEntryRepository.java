package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.PrEntry;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrEntryRepository extends JpaRepository<PrEntry, UUID> {

  List<PrEntry> findByExerciseIdAndUserIdOrderByLoggedOnDescCreatedAtDesc(
      UUID exerciseId, UUID userId);

  List<PrEntry> findByUserIdOrderByLoggedOnDescCreatedAtDesc(UUID userId);

  long countByUserId(UUID userId);
}
