package com.wodlog.workoutbackend.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ExerciseDto(
    UUID id,
    String name,
    String category,
    String currentPr,
    List<PrEntryDto> history
) {
  public record PrEntryDto(UUID id, String value, LocalDate dateKey, String notes) {}
}
