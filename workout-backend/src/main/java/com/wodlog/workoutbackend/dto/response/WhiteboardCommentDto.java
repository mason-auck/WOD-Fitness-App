package com.wodlog.workoutbackend.dto.response;

import java.time.Instant;
import java.util.UUID;

public record WhiteboardCommentDto(
    UUID id, String author, UUID authorId, String text, Instant createdAt) {}
