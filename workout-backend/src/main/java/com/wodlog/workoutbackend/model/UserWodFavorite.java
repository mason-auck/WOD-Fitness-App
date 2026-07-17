package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "user_wod_favorites")
public class UserWodFavorite {

  @EmbeddedId
  private UserWodFavoriteId id;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    createdAt = Instant.now();
  }

  public UserWodFavoriteId getId() {
    return id;
  }

  public void setId(UserWodFavoriteId id) {
    this.id = id;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
