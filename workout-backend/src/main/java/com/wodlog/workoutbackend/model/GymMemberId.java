package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class GymMemberId implements Serializable {

  @Column(name = "gym_id")
  private UUID gymId;

  @Column(name = "user_id")
  private UUID userId;

  public GymMemberId() {}

  public GymMemberId(UUID gymId, UUID userId) {
    this.gymId = gymId;
    this.userId = userId;
  }

  public UUID getGymId() {
    return gymId;
  }

  public void setGymId(UUID gymId) {
    this.gymId = gymId;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof GymMemberId that)) {
      return false;
    }
    return Objects.equals(gymId, that.gymId) && Objects.equals(userId, that.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(gymId, userId);
  }
}
