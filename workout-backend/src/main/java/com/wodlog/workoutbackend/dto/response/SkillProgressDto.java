package com.wodlog.workoutbackend.dto.response;

public record SkillProgressDto(
    long totalXp,
    SkillLevelDto currentLevel,
    SkillLevelDto nextLevel,
    long xpIntoLevel,
    long xpToNextLevel,
    double progressPercent,
    boolean isMaxLevel
) {}
