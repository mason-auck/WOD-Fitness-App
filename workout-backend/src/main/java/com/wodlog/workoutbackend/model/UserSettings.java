package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_settings")
public class UserSettings {

  @Id
  @Column(name = "user_id")
  private UUID userId;

  @Column(name = "unit_system", nullable = false)
  private String unitSystem = "imperial";

  @Column(name = "keep_screen_on", nullable = false)
  private boolean keepScreenOn;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @PrePersist
  @PreUpdate
  void touch() {
    updatedAt = Instant.now();
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public String getUnitSystem() {
    return unitSystem;
  }

  public void setUnitSystem(String unitSystem) {
    this.unitSystem = unitSystem;
  }

  public boolean isKeepScreenOn() {
    return keepScreenOn;
  }

  public void setKeepScreenOn(boolean keepScreenOn) {
    this.keepScreenOn = keepScreenOn;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
