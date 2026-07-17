package com.wodlog.workoutbackend.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record WhiteboardPostDto(
    UUID id,
    String author,
    UUID authorId,
    String wodTitle,
    String wodType,
    String score,
    String notes,
    String caption,
    Instant createdAt,
    long likes,
    boolean likedByMe,
    List<WhiteboardCommentDto> comments,
    String visibility,
    UUID gymId
) {}
