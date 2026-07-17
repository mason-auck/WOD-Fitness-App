package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.WhiteboardLike;
import com.wodlog.workoutbackend.model.WhiteboardLikeId;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WhiteboardLikeRepository
    extends JpaRepository<WhiteboardLike, WhiteboardLikeId> {

  long countByIdPostId(UUID postId);

  boolean existsByIdPostIdAndIdUserId(UUID postId, UUID userId);

  @Query(
      """
      SELECT l.id.postId FROM WhiteboardLike l
      WHERE l.id.userId = :userId AND l.id.postId IN :postIds
      """)
  Set<UUID> findLikedPostIds(
      @Param("userId") UUID userId, @Param("postIds") Collection<UUID> postIds);
}
