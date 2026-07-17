package com.wodlog.workoutbackend.service;

import com.wodlog.workoutbackend.dto.request.CreateActivityLogRequest;
import com.wodlog.workoutbackend.dto.response.ActivityLogDto;
import com.wodlog.workoutbackend.exception.ApiException;
import com.wodlog.workoutbackend.model.ActivityLog;
import com.wodlog.workoutbackend.model.Exercise;
import com.wodlog.workoutbackend.model.PrEntry;
import com.wodlog.workoutbackend.model.Wod;
import com.wodlog.workoutbackend.repository.ActivityLogRepository;
import com.wodlog.workoutbackend.repository.ExerciseRepository;
import com.wodlog.workoutbackend.repository.PrEntryRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ActivityLogService {

  private final ActivityLogRepository activityLogRepository;
  private final ExerciseRepository exerciseRepository;
  private final PrEntryRepository prEntryRepository;
  private final WodService wodService;
  private final ProfileService profileService;
  private final XpService xpService;

  public ActivityLogService(
      ActivityLogRepository activityLogRepository,
      ExerciseRepository exerciseRepository,
      PrEntryRepository prEntryRepository,
      WodService wodService,
      ProfileService profileService,
      XpService xpService) {
    this.activityLogRepository = activityLogRepository;
    this.exerciseRepository = exerciseRepository;
    this.prEntryRepository = prEntryRepository;
    this.wodService = wodService;
    this.profileService = profileService;
    this.xpService = xpService;
  }

  @Transactional(readOnly = true)
  public List<ActivityLogDto> list(UUID userId, LocalDate from, LocalDate to, String kind) {
    profileService.requireProfile(userId);
    List<ActivityLog> logs;
    if (from != null && to != null) {
      logs =
          activityLogRepository.findByUserIdAndLoggedOnBetweenOrderByLoggedOnDescCreatedAtDesc(
              userId, from, to);
    } else {
      logs = activityLogRepository.findByUserIdOrderByLoggedOnDescCreatedAtDesc(userId);
    }
    return logs.stream()
        .filter(log -> kind == null || kind.equalsIgnoreCase(log.getKind()))
        .map(ActivityLogService::toDto)
        .toList();
  }

  @Transactional(readOnly = true)
  public ActivityLogDto get(UUID userId, UUID id) {
    return toDto(requireOwned(userId, id));
  }

  @Transactional
  public ActivityLogDto create(UUID userId, CreateActivityLogRequest request) {
    profileService.requireProfile(userId);
    String kind = request.kind().trim().toLowerCase();
    if (!kind.equals("wod") && !kind.equals("pr")) {
      throw ApiException.badRequest("kind must be 'wod' or 'pr'");
    }

    ActivityLog log = new ActivityLog();
    log.setUserId(userId);
    log.setKind(kind);
    log.setLoggedOn(request.loggedOn());
    log.setResult(request.result().trim());
    log.setNotes(blankToNull(request.notes()));

    if (kind.equals("wod")) {
      if (request.wodId() == null) {
        throw ApiException.badRequest("wodId is required for wod logs");
      }
      Wod wod = wodService.requireWod(request.wodId());
      log.setWodId(wod.getId());
      log.setTitle(wod.getTitle());
      log.setWodType(wod.getType());
      ActivityLog saved = activityLogRepository.save(log);
      xpService.awardWodLog(userId, saved.getId());
      return toDto(saved);
    }

    if (request.exerciseId() == null) {
      throw ApiException.badRequest("exerciseId is required for pr logs");
    }
    Exercise exercise =
        exerciseRepository
            .findByIdAndUserId(request.exerciseId(), userId)
            .orElseThrow(() -> ApiException.notFound("Exercise not found"));

    PrEntry entry = new PrEntry();
    entry.setExerciseId(exercise.getId());
    entry.setUserId(userId);
    entry.setValue(request.result().trim());
    entry.setLoggedOn(request.loggedOn());
    entry.setNotes(blankToNull(request.notes()));
    PrEntry savedEntry = prEntryRepository.save(entry);

    log.setExerciseId(exercise.getId());
    log.setTitle(exercise.getName());
    ActivityLog saved = activityLogRepository.save(log);
    xpService.awardPrLog(userId, savedEntry.getId());
    return toDto(saved);
  }

  @Transactional
  public void delete(UUID userId, UUID id) {
    ActivityLog log = requireOwned(userId, id);
    activityLogRepository.delete(log);
  }

  private ActivityLog requireOwned(UUID userId, UUID id) {
    profileService.requireProfile(userId);
    return activityLogRepository
        .findByIdAndUserId(id, userId)
        .orElseThrow(() -> ApiException.notFound("Activity log not found"));
  }

  static ActivityLogDto toDto(ActivityLog log) {
    return new ActivityLogDto(
        log.getId(),
        log.getKind(),
        log.getLoggedOn(),
        log.getWodId(),
        log.getExerciseId(),
        log.getTitle(),
        log.getWodType(),
        log.getResult(),
        log.getNotes());
  }

  private static String blankToNull(String value) {
    return StringUtils.hasText(value) ? value.trim() : null;
  }
}
