package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.GymMember;
import com.wodlog.workoutbackend.model.GymMemberId;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GymMemberRepository extends JpaRepository<GymMember, GymMemberId> {

  List<GymMember> findByIdUserId(UUID userId);

  boolean existsByIdGymIdAndIdUserId(UUID gymId, UUID userId);
}
