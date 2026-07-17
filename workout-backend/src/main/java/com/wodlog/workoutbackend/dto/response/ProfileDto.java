package com.wodlog.workoutbackend.dto.response;

import java.time.Instant;
import java.util.UUID;

public record ProfileDto(
    UUID id,
    String username,
    String displayName,
    String avatarUrl,
    Instant createdAt,
    Instant updatedAt
) {}
