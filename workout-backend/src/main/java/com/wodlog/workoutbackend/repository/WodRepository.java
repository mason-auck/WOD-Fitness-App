package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.Wod;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WodRepository extends JpaRepository<Wod, UUID> {

  @Query(
      """
      SELECT w FROM Wod w
      WHERE (:q IS NULL OR LOWER(w.title) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%'))
          OR LOWER(w.description) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')))
        AND (:type IS NULL OR w.type = :type)
        AND (:category IS NULL OR w.category = :category)
        AND (
          :favoritesOnly = FALSE
          OR w.id IN (
            SELECT f.id.wodId FROM UserWodFavorite f WHERE f.id.userId = :userId
          )
        )
      ORDER BY w.title ASC
      """)
  List<Wod> search(
      @Param("userId") UUID userId,
      @Param("q") String q,
      @Param("type") String type,
      @Param("category") String category,
      @Param("favoritesOnly") boolean favoritesOnly);
}
