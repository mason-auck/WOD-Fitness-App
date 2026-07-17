package com.wodlog.workoutbackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public record CreateActivityLogRequest(
    @NotBlank String kind,
    @NotNull LocalDate loggedOn,
    UUID wodId,
    UUID exerciseId,
    @NotBlank @Size(max = 120) String result,
    @Size(max = 2000) String notes
) {}
