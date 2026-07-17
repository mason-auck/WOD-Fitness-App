package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.UserWodFavorite;
import com.wodlog.workoutbackend.model.UserWodFavoriteId;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserWodFavoriteRepository
    extends JpaRepository<UserWodFavorite, UserWodFavoriteId> {

  @Query(
      """
      SELECT f.id.wodId FROM UserWodFavorite f
      WHERE f.id.userId = :userId AND f.id.wodId IN :wodIds
      """)
  Set<UUID> findFavoriteWodIds(
      @Param("userId") UUID userId, @Param("wodIds") Collection<UUID> wodIds);

  boolean existsByIdUserIdAndIdWodId(UUID userId, UUID wodId);
}
