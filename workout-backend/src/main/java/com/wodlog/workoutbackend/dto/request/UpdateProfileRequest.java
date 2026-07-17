package com.wodlog.workoutbackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @Size(min = 3, max = 40) String username,
    @Size(min = 1, max = 80) String displayName,
    String avatarUrl
) {}
