package com.wodlog.workoutbackend.service;

import com.wodlog.workoutbackend.dto.request.UpdateProfileRequest;
import com.wodlog.workoutbackend.dto.response.ProfileDto;
import com.wodlog.workoutbackend.dto.response.ProfileStatsDto;
import com.wodlog.workoutbackend.dto.response.RecentActivityDto;
import com.wodlog.workoutbackend.exception.ApiException;
import com.wodlog.workoutbackend.model.ActivityLog;
import com.wodlog.workoutbackend.model.Profile;
import com.wodlog.workoutbackend.repository.ActivityLogRepository;
import com.wodlog.workoutbackend.repository.PrEntryRepository;
import com.wodlog.workoutbackend.repository.ProfileRepository;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

  private final ProfileRepository profileRepository;
  private final ActivityLogRepository activityLogRepository;
  private final PrEntryRepository prEntryRepository;

  public ProfileService(
      ProfileRepository profileRepository,
      ActivityLogRepository activityLogRepository,
      PrEntryRepository prEntryRepository) {
    this.profileRepository = profileRepository;
    this.activityLogRepository = activityLogRepository;
    this.prEntryRepository = prEntryRepository;
  }

  @Transactional(readOnly = true)
  public ProfileDto getMe(UUID userId) {
    return toDto(requireProfile(userId));
  }

  @Transactional
  public ProfileDto updateMe(UUID userId, UpdateProfileRequest request) {
    Profile profile = requireProfile(userId);

    if (request.username() != null && !request.username().isBlank()) {
      String username = request.username().trim();
      if (profileRepository.existsByUsernameIgnoreCaseAndIdNot(username, userId)) {
        throw ApiException.conflict("Username is already taken");
      }
      profile.setUsername(username);
    }
    if (request.displayName() != null && !request.displayName().isBlank()) {
      profile.setDisplayName(request.displayName().trim());
    }
    if (request.avatarUrl() != null) {
      profile.setAvatarUrl(request.avatarUrl().isBlank() ? null : request.avatarUrl().trim());
    }

    return toDto(profileRepository.save(profile));
  }

  @Transactional(readOnly = true)
  public ProfileStatsDto getStats(UUID userId) {
    requireProfile(userId);
    long workouts = activityLogRepository.countByUserIdAndKind(userId, "wod");
    long prs = prEntryRepository.countByUserId(userId);
    long streak = computeStreakDays(userId);
    return new ProfileStatsDto(workouts, prs, streak);
  }

  @Transactional(readOnly = true)
  public List<RecentActivityDto> getRecentActivity(UUID userId) {
    requireProfile(userId);
    return activityLogRepository.findTop10ByUserIdOrderByLoggedOnDescCreatedAtDesc(userId).stream()
        .map(
            log ->
                new RecentActivityDto(
                    log.getId(), log.getKind(), log.getTitle(), log.getLoggedOn(), log.getResult()))
        .toList();
  }

  public Profile requireProfile(UUID userId) {
    return profileRepository
        .findById(userId)
        .orElseThrow(() -> ApiException.notFound("Profile not found for current user"));
  }

  private long computeStreakDays(UUID userId) {
    List<ActivityLog> logs =
        activityLogRepository.findByUserIdOrderByLoggedOnDescCreatedAtDesc(userId);
    if (logs.isEmpty()) {
      return 0;
    }

    Set<LocalDate> days = new HashSet<>();
    for (ActivityLog log : logs) {
      days.add(log.getLoggedOn());
    }

    LocalDate cursor = LocalDate.now();
    if (!days.contains(cursor) && !days.contains(cursor.minusDays(1))) {
      return 0;
    }
    if (!days.contains(cursor)) {
      cursor = cursor.minusDays(1);
    }

    long streak = 0;
    while (days.contains(cursor)) {
      streak++;
      cursor = cursor.minusDays(1);
    }
    return streak;
  }

  private ProfileDto toDto(Profile profile) {
    return new ProfileDto(
        profile.getId(),
        profile.getUsername(),
        profile.getDisplayName(),
        profile.getAvatarUrl(),
        profile.getCreatedAt(),
        profile.getUpdatedAt());
  }
}
