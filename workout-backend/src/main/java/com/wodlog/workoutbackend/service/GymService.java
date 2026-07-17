package com.wodlog.workoutbackend.service;

import com.wodlog.workoutbackend.dto.response.GymDto;
import com.wodlog.workoutbackend.exception.ApiException;
import com.wodlog.workoutbackend.model.Gym;
import com.wodlog.workoutbackend.model.GymMember;
import com.wodlog.workoutbackend.repository.GymMemberRepository;
import com.wodlog.workoutbackend.repository.GymRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GymService {

  private final GymRepository gymRepository;
  private final GymMemberRepository gymMemberRepository;
  private final ProfileService profileService;

  public GymService(
      GymRepository gymRepository,
      GymMemberRepository gymMemberRepository,
      ProfileService profileService) {
    this.gymRepository = gymRepository;
    this.gymMemberRepository = gymMemberRepository;
    this.profileService = profileService;
  }

  @Transactional(readOnly = true)
  public List<GymDto> listMine(UUID userId) {
    profileService.requireProfile(userId);
    Map<UUID, String> roles =
        gymMemberRepository.findByIdUserId(userId).stream()
            .collect(Collectors.toMap(m -> m.getId().getGymId(), GymMember::getRole));
    return gymRepository.findByMemberUserId(userId).stream()
        .map(gym -> new GymDto(gym.getId(), gym.getName(), roles.get(gym.getId())))
        .toList();
  }

  @Transactional(readOnly = true)
  public void requireMembership(UUID userId, UUID gymId) {
    if (!gymMemberRepository.existsByIdGymIdAndIdUserId(gymId, userId)) {
      throw ApiException.forbidden("You are not a member of this gym");
    }
  }

  public Gym requireGym(UUID gymId) {
    return gymRepository
        .findById(gymId)
        .orElseThrow(() -> ApiException.notFound("Gym not found"));
  }

  @Transactional(readOnly = true)
  public List<UUID> memberGymIds(UUID userId) {
    return gymMemberRepository.findByIdUserId(userId).stream()
        .map(member -> member.getId().getGymId())
        .toList();
  }
}
