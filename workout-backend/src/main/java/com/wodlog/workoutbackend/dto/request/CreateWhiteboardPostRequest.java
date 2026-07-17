package com.wodlog.workoutbackend.dto.request;

import com.wodlog.workoutbackend.validation.ValidWodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateWhiteboardPostRequest(
    UUID wodId,
    @NotBlank @Size(max = 120) String wodTitle,
    @NotBlank @ValidWodType String wodType,
    @NotBlank @Size(max = 120) String score,
    @Size(max = 2000) String notes,
    @Size(max = 500) String caption,
    @NotBlank String visibility,
    UUID gymId
) {}
