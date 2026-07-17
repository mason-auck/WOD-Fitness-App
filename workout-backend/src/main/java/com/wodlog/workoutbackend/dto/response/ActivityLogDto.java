package com.wodlog.workoutbackend.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record ActivityLogDto(
    UUID id,
    String kind,
    LocalDate dateKey,
    UUID wodId,
    UUID exerciseId,
    String title,
    String wodType,
    String result,
    String notes
) {}
