package com.wodlog.workoutbackend.dto.request;

import com.wodlog.workoutbackend.validation.UnitSystem;
import jakarta.validation.constraints.NotNull;

public record UpdateSettingsRequest(
    @NotNull @UnitSystem String unitSystem, @NotNull Boolean keepScreenOn) {}
