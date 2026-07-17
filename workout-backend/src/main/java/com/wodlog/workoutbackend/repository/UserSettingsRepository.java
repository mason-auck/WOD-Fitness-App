package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.UserSettings;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSettingsRepository extends JpaRepository<UserSettings, UUID> {}
