package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class UserWodFavoriteId implements Serializable {

  @Column(name = "user_id")
  private UUID userId;

  @Column(name = "wod_id")
  private UUID wodId;

  public UserWodFavoriteId() {}

  public UserWodFavoriteId(UUID userId, UUID wodId) {
    this.userId = userId;
    this.wodId = wodId;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public UUID getWodId() {
    return wodId;
  }

  public void setWodId(UUID wodId) {
    this.wodId = wodId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof UserWodFavoriteId that)) {
      return false;
    }
    return Objects.equals(userId, that.userId) && Objects.equals(wodId, that.wodId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(userId, wodId);
  }
}
