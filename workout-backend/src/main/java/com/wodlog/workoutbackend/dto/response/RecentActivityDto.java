package com.wodlog.workoutbackend.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record RecentActivityDto(
    UUID id, String kind, String title, LocalDate date, String result) {}
