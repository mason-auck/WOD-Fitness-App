package com.wodlog.workoutbackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RenameExerciseRequest(@NotBlank @Size(max = 120) String name) {}
