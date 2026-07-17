package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "whiteboard_likes")
public class WhiteboardLike {

  @EmbeddedId
  private WhiteboardLikeId id;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    createdAt = Instant.now();
  }

  public WhiteboardLikeId getId() {
    return id;
  }

  public void setId(WhiteboardLikeId id) {
    this.id = id;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
