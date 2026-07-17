package com.wodlog.workoutbackend.controller;

import com.wodlog.workoutbackend.dto.request.UpdateProfileRequest;
import com.wodlog.workoutbackend.dto.response.MeSkillDto;
import com.wodlog.workoutbackend.dto.response.ProfileDto;
import com.wodlog.workoutbackend.dto.response.ProfileStatsDto;
import com.wodlog.workoutbackend.dto.response.RecentActivityDto;
import com.wodlog.workoutbackend.security.CurrentUser;
import com.wodlog.workoutbackend.service.ProfileService;
import com.wodlog.workoutbackend.service.SkillService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/me")
public class MeController {

  private final ProfileService profileService;
  private final SkillService skillService;

  public MeController(ProfileService profileService, SkillService skillService) {
    this.profileService = profileService;
    this.skillService = skillService;
  }

  @GetMapping
  public ProfileDto me() {
    return profileService.getMe(CurrentUser.id());
  }

  @PatchMapping
  public ProfileDto update(@Valid @RequestBody UpdateProfileRequest request) {
    return profileService.updateMe(CurrentUser.id(), request);
  }

  @GetMapping("/stats")
  public ProfileStatsDto stats() {
    return profileService.getStats(CurrentUser.id());
  }

  @GetMapping("/recent-activity")
  public List<RecentActivityDto> recentActivity() {
    return profileService.getRecentActivity(CurrentUser.id());
  }

  @GetMapping("/skill")
  public MeSkillDto skill() {
    return skillService.getMeSkill(CurrentUser.id());
  }
}
