package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.Exercise;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {

  List<Exercise> findByUserIdOrderByNameAsc(UUID userId);

  Optional<Exercise> findByIdAndUserId(UUID id, UUID userId);

  boolean existsByUserIdAndNameIgnoreCase(UUID userId, String name);

  boolean existsByUserIdAndNameIgnoreCaseAndIdNot(UUID userId, String name, UUID id);
}
