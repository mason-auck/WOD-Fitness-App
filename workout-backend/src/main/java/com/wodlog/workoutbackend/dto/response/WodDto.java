package com.wodlog.workoutbackend.dto.response;

import java.util.UUID;

public record WodDto(
    UUID id,
    String title,
    String type,
    String category,
    String description,
    boolean favorited,
    boolean isUserCreated,
    String source
) {}
