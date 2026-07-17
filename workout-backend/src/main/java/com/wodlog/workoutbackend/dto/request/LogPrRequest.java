package com.wodlog.workoutbackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record LogPrRequest(
    @NotBlank @Size(max = 80) String value, LocalDate loggedOn, @Size(max = 2000) String notes) {}
