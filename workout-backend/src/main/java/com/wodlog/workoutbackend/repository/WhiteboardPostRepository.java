package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.WhiteboardPost;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WhiteboardPostRepository extends JpaRepository<WhiteboardPost, UUID> {

  @Query(
      """
      SELECT p FROM WhiteboardPost p
      WHERE (
          p.visibility = 'public'
          OR (p.visibility = 'gym' AND p.gymId IN :gymIds)
        )
        AND (
          :q IS NULL
          OR LOWER(p.wodTitle) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%'))
          OR LOWER(COALESCE(p.caption, '')) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%'))
        )
        AND (:visibility IS NULL OR p.visibility = :visibility)
      ORDER BY p.createdAt DESC
      """)
  List<WhiteboardPost> findFeed(
      @Param("gymIds") Collection<UUID> gymIds,
      @Param("q") String q,
      @Param("visibility") String visibility);
}
