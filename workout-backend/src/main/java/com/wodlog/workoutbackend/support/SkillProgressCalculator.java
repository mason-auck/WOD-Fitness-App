package com.wodlog.workoutbackend.support;

import com.wodlog.workoutbackend.dto.response.SkillLevelDto;
import com.wodlog.workoutbackend.dto.response.SkillProgressDto;
import com.wodlog.workoutbackend.model.SkillLevelEntity;
import java.util.List;

public final class SkillProgressCalculator {

  private SkillProgressCalculator() {}

  public static SkillProgressDto compute(long totalXp, List<SkillLevelEntity> levels) {
    if (levels.isEmpty()) {
      throw new IllegalArgumentException("Skill levels catalog is empty");
    }

    SkillLevelEntity current = levels.getFirst();
    for (SkillLevelEntity level : levels) {
      if (totalXp >= level.getXpRequired()) {
        current = level;
      }
    }

    int currentIndex = levels.indexOf(current);
    SkillLevelEntity next =
        currentIndex + 1 < levels.size() ? levels.get(currentIndex + 1) : null;
    boolean isMaxLevel = next == null;

    long xpIntoLevel = totalXp - current.getXpRequired();
    long xpToNextLevel = isMaxLevel ? 0 : next.getXpRequired() - current.getXpRequired();
    double progressPercent =
        isMaxLevel ? 1.0 : Math.min(1.0, (double) xpIntoLevel / (double) xpToNextLevel);

    return new SkillProgressDto(
        totalXp,
        toDto(current),
        next == null ? null : toDto(next),
        xpIntoLevel,
        xpToNextLevel,
        progressPercent,
        isMaxLevel);
  }

  public static SkillLevelDto toDto(SkillLevelEntity entity) {
    return new SkillLevelDto(entity.getLevel(), entity.getTitle(), entity.getXpRequired());
  }
}
