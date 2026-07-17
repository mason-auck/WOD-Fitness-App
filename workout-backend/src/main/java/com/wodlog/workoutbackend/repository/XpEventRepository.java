package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.XpEvent;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface XpEventRepository extends JpaRepository<XpEvent, UUID> {

  boolean existsBySourceAndSourceId(String source, UUID sourceId);

  @Query("SELECT COALESCE(SUM(e.xp), 0) FROM XpEvent e WHERE e.userId = :userId")
  long sumXpByUserId(@Param("userId") UUID userId);

  long countByUserIdAndSource(UUID userId, String source);
}
