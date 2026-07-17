package com.wodlog.workoutbackend.dto.response;

public record MeSkillDto(
    long totalXp,
    long wodsLogged,
    long prsLogged,
    SkillProgressDto skillProgress
) {}
