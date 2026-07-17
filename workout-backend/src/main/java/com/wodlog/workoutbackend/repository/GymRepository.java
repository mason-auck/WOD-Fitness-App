package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.Gym;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GymRepository extends JpaRepository<Gym, UUID> {

  @Query(
      """
      SELECT g FROM Gym g
      JOIN GymMember m ON m.id.gymId = g.id
      WHERE m.id.userId = :userId
      ORDER BY g.name ASC
      """)
  List<Gym> findByMemberUserId(@Param("userId") UUID userId);
}
