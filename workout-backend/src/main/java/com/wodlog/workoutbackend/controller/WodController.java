package com.wodlog.workoutbackend.controller;

import com.wodlog.workoutbackend.dto.request.CreateWodRequest;
import com.wodlog.workoutbackend.dto.response.ActivityLogDto;
import com.wodlog.workoutbackend.dto.response.WodDto;
import com.wodlog.workoutbackend.security.CurrentUser;
import com.wodlog.workoutbackend.service.WodService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
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
@RequestMapping("/api/v1/wods")
public class WodController {

  private final WodService wodService;

  public WodController(WodService wodService) {
    this.wodService = wodService;
  }

  @GetMapping
  public List<WodDto> list(
      @RequestParam(required = false) String q,
      @RequestParam(required = false) String type,
      @RequestParam(required = false) String category,
      @RequestParam(required = false, defaultValue = "false") boolean favorites) {
    return wodService.list(CurrentUser.id(), q, type, category, favorites);
  }

  @GetMapping("/{id}")
  public WodDto get(@PathVariable UUID id) {
    return wodService.get(CurrentUser.id(), id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public WodDto create(@Valid @RequestBody CreateWodRequest request) {
    return wodService.create(CurrentUser.id(), request);
  }

  @PostMapping("/{id}/favorite")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void favorite(@PathVariable UUID id) {
    wodService.favorite(CurrentUser.id(), id);
  }

  @DeleteMapping("/{id}/favorite")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void unfavorite(@PathVariable UUID id) {
    wodService.unfavorite(CurrentUser.id(), id);
  }

  @GetMapping("/{id}/history")
  public List<ActivityLogDto> history(@PathVariable UUID id) {
    return wodService.history(CurrentUser.id(), id);
  }
}
