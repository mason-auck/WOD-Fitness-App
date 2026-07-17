package com.wodlog.workoutbackend.service;

import com.wodlog.workoutbackend.dto.request.CreateExerciseRequest;
import com.wodlog.workoutbackend.dto.request.LogPrRequest;
import com.wodlog.workoutbackend.dto.request.RenameExerciseRequest;
import com.wodlog.workoutbackend.dto.response.ExerciseDto;
import com.wodlog.workoutbackend.exception.ApiException;
import com.wodlog.workoutbackend.model.ActivityLog;
import com.wodlog.workoutbackend.model.Exercise;
import com.wodlog.workoutbackend.model.PrEntry;
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
public class ExerciseService {

  private final ExerciseRepository exerciseRepository;
  private final PrEntryRepository prEntryRepository;
  private final ActivityLogRepository activityLogRepository;
  private final ProfileService profileService;
  private final XpService xpService;

  public ExerciseService(
      ExerciseRepository exerciseRepository,
      PrEntryRepository prEntryRepository,
      ActivityLogRepository activityLogRepository,
      ProfileService profileService,
      XpService xpService) {
    this.exerciseRepository = exerciseRepository;
    this.prEntryRepository = prEntryRepository;
    this.activityLogRepository = activityLogRepository;
    this.profileService = profileService;
    this.xpService = xpService;
  }

  @Transactional(readOnly = true)
  public List<ExerciseDto> list(UUID userId) {
    profileService.requireProfile(userId);
    return exerciseRepository.findByUserIdOrderByNameAsc(userId).stream()
        .map(exercise -> toDto(exercise, historyFor(exercise.getId(), userId), false))
        .toList();
  }

  @Transactional(readOnly = true)
  public ExerciseDto get(UUID userId, UUID exerciseId) {
    Exercise exercise = requireOwned(userId, exerciseId);
    return toDto(exercise, historyFor(exerciseId, userId), true);
  }

  @Transactional
  public ExerciseDto create(UUID userId, CreateExerciseRequest request) {
    profileService.requireProfile(userId);
    String name = request.name().trim();
    if (exerciseRepository.existsByUserIdAndNameIgnoreCase(userId, name)) {
      throw ApiException.conflict("You already have an exercise with that name");
    }

    Exercise exercise = new Exercise();
    exercise.setUserId(userId);
    exercise.setName(name);
    exercise.setCategory(
        StringUtils.hasText(request.category()) ? request.category().trim() : "Custom");
    Exercise saved = exerciseRepository.save(exercise);
    return toDto(saved, List.of(), true);
  }

  @Transactional
  public ExerciseDto rename(UUID userId, UUID exerciseId, RenameExerciseRequest request) {
    Exercise exercise = requireOwned(userId, exerciseId);
    String name = request.name().trim();
    if (exerciseRepository.existsByUserIdAndNameIgnoreCaseAndIdNot(userId, name, exerciseId)) {
      throw ApiException.conflict("You already have an exercise with that name");
    }
    exercise.setName(name);
    return toDto(exerciseRepository.save(exercise), historyFor(exerciseId, userId), true);
  }

  @Transactional
  public void delete(UUID userId, UUID exerciseId) {
    Exercise exercise = requireOwned(userId, exerciseId);
    exerciseRepository.delete(exercise);
  }

  @Transactional
  public ExerciseDto.PrEntryDto logPr(UUID userId, UUID exerciseId, LogPrRequest request) {
    Exercise exercise = requireOwned(userId, exerciseId);
    LocalDate loggedOn = request.loggedOn() == null ? LocalDate.now() : request.loggedOn();

    PrEntry entry = new PrEntry();
    entry.setExerciseId(exerciseId);
    entry.setUserId(userId);
    entry.setValue(request.value().trim());
    entry.setLoggedOn(loggedOn);
    entry.setNotes(blankToNull(request.notes()));
    PrEntry saved = prEntryRepository.save(entry);

    ActivityLog log = new ActivityLog();
    log.setUserId(userId);
    log.setKind("pr");
    log.setLoggedOn(loggedOn);
    log.setExerciseId(exerciseId);
    log.setTitle(exercise.getName());
    log.setResult(saved.getValue());
    log.setNotes(saved.getNotes());
    activityLogRepository.save(log);

    xpService.awardPrLog(userId, saved.getId());

    return new ExerciseDto.PrEntryDto(
        saved.getId(), saved.getValue(), saved.getLoggedOn(), saved.getNotes());
  }

  @Transactional(readOnly = true)
  public List<ExerciseDto.PrEntryDto> entries(UUID userId, UUID exerciseId) {
    requireOwned(userId, exerciseId);
    return historyFor(exerciseId, userId);
  }

  private Exercise requireOwned(UUID userId, UUID exerciseId) {
    profileService.requireProfile(userId);
    return exerciseRepository
        .findByIdAndUserId(exerciseId, userId)
        .orElseThrow(() -> ApiException.notFound("Exercise not found"));
  }

  private List<ExerciseDto.PrEntryDto> historyFor(UUID exerciseId, UUID userId) {
    return prEntryRepository
        .findByExerciseIdAndUserIdOrderByLoggedOnDescCreatedAtDesc(exerciseId, userId)
        .stream()
        .map(
            entry ->
                new ExerciseDto.PrEntryDto(
                    entry.getId(), entry.getValue(), entry.getLoggedOn(), entry.getNotes()))
        .toList();
  }

  private ExerciseDto toDto(
      Exercise exercise, List<ExerciseDto.PrEntryDto> history, boolean includeHistory) {
    String currentPr = history.isEmpty() ? null : history.getFirst().value();
    return new ExerciseDto(
        exercise.getId(),
        exercise.getName(),
        exercise.getCategory(),
        currentPr,
        includeHistory ? history : List.of());
  }

  private static String blankToNull(String value) {
    return StringUtils.hasText(value) ? value.trim() : null;
  }
}
