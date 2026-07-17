package com.wodlog.workoutbackend.controller;

import com.wodlog.workoutbackend.dto.request.CreateActivityLogRequest;
import com.wodlog.workoutbackend.dto.response.ActivityLogDto;
import com.wodlog.workoutbackend.security.CurrentUser;
import com.wodlog.workoutbackend.service.ActivityLogService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/activity-logs")
public class ActivityLogController {

  private final ActivityLogService activityLogService;

  public ActivityLogController(ActivityLogService activityLogService) {
    this.activityLogService = activityLogService;
  }

  @GetMapping
  public List<ActivityLogDto> list(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
      @RequestParam(required = false) String kind) {
    return activityLogService.list(CurrentUser.id(), from, to, kind);
  }

  @GetMapping("/{id}")
  public ActivityLogDto get(@PathVariable UUID id) {
    return activityLogService.get(CurrentUser.id(), id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ActivityLogDto create(@Valid @RequestBody CreateActivityLogRequest request) {
    return activityLogService.create(CurrentUser.id(), request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable UUID id) {
    activityLogService.delete(CurrentUser.id(), id);
  }
}
