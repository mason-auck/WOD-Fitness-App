package com.wodlog.workoutbackend.service;

import com.wodlog.workoutbackend.dto.response.MeSkillDto;
import com.wodlog.workoutbackend.dto.response.SkillLevelDto;
import com.wodlog.workoutbackend.dto.response.SkillProgressDto;
import com.wodlog.workoutbackend.model.SkillLevelEntity;
import com.wodlog.workoutbackend.repository.ActivityLogRepository;
import com.wodlog.workoutbackend.repository.PrEntryRepository;
import com.wodlog.workoutbackend.repository.SkillLevelRepository;
import com.wodlog.workoutbackend.support.SkillProgressCalculator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SkillService {

  private final SkillLevelRepository skillLevelRepository;
  private final XpService xpService;
  private final ActivityLogRepository activityLogRepository;
  private final PrEntryRepository prEntryRepository;
  private final ProfileService profileService;

  public SkillService(
      SkillLevelRepository skillLevelRepository,
      XpService xpService,
      ActivityLogRepository activityLogRepository,
      PrEntryRepository prEntryRepository,
      ProfileService profileService) {
    this.skillLevelRepository = skillLevelRepository;
    this.xpService = xpService;
    this.activityLogRepository = activityLogRepository;
    this.prEntryRepository = prEntryRepository;
    this.profileService = profileService;
  }

  @Transactional(readOnly = true)
  public List<SkillLevelDto> listLevels() {
    return skillLevelRepository.findAllByOrderByLevelAsc().stream()
        .map(SkillProgressCalculator::toDto)
        .toList();
  }

  @Transactional(readOnly = true)
  public MeSkillDto getMeSkill(UUID userId) {
    profileService.requireProfile(userId);
    List<SkillLevelEntity> levels = skillLevelRepository.findAllByOrderByLevelAsc();
    long totalXp = xpService.totalXp(userId);
    SkillProgressDto progress = SkillProgressCalculator.compute(totalXp, levels);
    long wodsLogged = activityLogRepository.countByUserIdAndKind(userId, "wod");
    long prsLogged = prEntryRepository.countByUserId(userId);
    return new MeSkillDto(totalXp, wodsLogged, prsLogged, progress);
  }
}
