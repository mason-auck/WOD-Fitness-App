package com.wodlog.workoutbackend.controller;

import com.wodlog.workoutbackend.dto.request.UpdateSettingsRequest;
import com.wodlog.workoutbackend.dto.response.SettingsDto;
import com.wodlog.workoutbackend.security.CurrentUser;
import com.wodlog.workoutbackend.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/settings")
public class SettingsController {

  private final SettingsService settingsService;

  public SettingsController(SettingsService settingsService) {
    this.settingsService = settingsService;
  }

  @GetMapping
  public SettingsDto get() {
    return settingsService.get(CurrentUser.id());
  }

  @PutMapping
  public SettingsDto update(@Valid @RequestBody UpdateSettingsRequest request) {
    return settingsService.update(CurrentUser.id(), request);
  }
}
