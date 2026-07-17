package com.wodlog.workoutbackend.service;

import com.wodlog.workoutbackend.dto.request.UpdateSettingsRequest;
import com.wodlog.workoutbackend.dto.response.SettingsDto;
import com.wodlog.workoutbackend.exception.ApiException;
import com.wodlog.workoutbackend.model.UserSettings;
import com.wodlog.workoutbackend.repository.UserSettingsRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsService {

  private final UserSettingsRepository userSettingsRepository;
  private final ProfileService profileService;

  public SettingsService(
      UserSettingsRepository userSettingsRepository, ProfileService profileService) {
    this.userSettingsRepository = userSettingsRepository;
    this.profileService = profileService;
  }

  @Transactional(readOnly = true)
  public SettingsDto get(UUID userId) {
    profileService.requireProfile(userId);
    UserSettings settings = requireSettings(userId);
    return toDto(settings);
  }

  @Transactional
  public SettingsDto update(UUID userId, UpdateSettingsRequest request) {
    profileService.requireProfile(userId);
    UserSettings settings = requireSettings(userId);
    settings.setUnitSystem(request.unitSystem());
    settings.setKeepScreenOn(Boolean.TRUE.equals(request.keepScreenOn()));
    return toDto(userSettingsRepository.save(settings));
  }

  private UserSettings requireSettings(UUID userId) {
    return userSettingsRepository
        .findById(userId)
        .orElseThrow(() -> ApiException.notFound("Settings not found for current user"));
  }

  private SettingsDto toDto(UserSettings settings) {
    return new SettingsDto(settings.getUnitSystem(), settings.isKeepScreenOn());
  }
}
