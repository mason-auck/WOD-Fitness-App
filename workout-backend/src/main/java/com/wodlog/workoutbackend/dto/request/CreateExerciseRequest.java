package com.wodlog.workoutbackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateExerciseRequest(
    @NotBlank @Size(max = 120) String name, @Size(max = 80) String category) {}
