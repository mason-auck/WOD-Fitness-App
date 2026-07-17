package com.wodlog.workoutbackend.dto.request;

import com.wodlog.workoutbackend.validation.ValidWodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateWodRequest(
    @NotBlank @Size(max = 120) String title,
    @NotBlank @ValidWodType String type,
    @Size(max = 4000) String description
) {}
