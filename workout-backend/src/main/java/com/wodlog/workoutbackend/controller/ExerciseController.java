package com.wodlog.workoutbackend.controller;

import com.wodlog.workoutbackend.dto.request.CreateExerciseRequest;
import com.wodlog.workoutbackend.dto.request.LogPrRequest;
import com.wodlog.workoutbackend.dto.request.RenameExerciseRequest;
import com.wodlog.workoutbackend.dto.response.ExerciseDto;
import com.wodlog.workoutbackend.security.CurrentUser;
import com.wodlog.workoutbackend.service.ExerciseService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/exercises")
public class ExerciseController {

  private final ExerciseService exerciseService;

  public ExerciseController(ExerciseService exerciseService) {
    this.exerciseService = exerciseService;
  }

  @GetMapping
  public List<ExerciseDto> list() {
    return exerciseService.list(CurrentUser.id());
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ExerciseDto create(@Valid @RequestBody CreateExerciseRequest request) {
    return exerciseService.create(CurrentUser.id(), request);
  }

  @GetMapping("/{id}")
  public ExerciseDto get(@PathVariable UUID id) {
    return exerciseService.get(CurrentUser.id(), id);
  }

  @PatchMapping("/{id}")
  public ExerciseDto rename(
      @PathVariable UUID id, @Valid @RequestBody RenameExerciseRequest request) {
    return exerciseService.rename(CurrentUser.id(), id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable UUID id) {
    exerciseService.delete(CurrentUser.id(), id);
  }

  @GetMapping("/{id}/entries")
  public List<ExerciseDto.PrEntryDto> entries(@PathVariable UUID id) {
    return exerciseService.entries(CurrentUser.id(), id);
  }

  @PostMapping("/{id}/entries")
  @ResponseStatus(HttpStatus.CREATED)
  public ExerciseDto.PrEntryDto logPr(
      @PathVariable UUID id, @Valid @RequestBody LogPrRequest request) {
    return exerciseService.logPr(CurrentUser.id(), id, request);
  }
}
