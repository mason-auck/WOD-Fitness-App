package com.wodlog.workoutbackend.dto.response;

import java.util.UUID;

public record GymDto(UUID id, String name, String role) {}
