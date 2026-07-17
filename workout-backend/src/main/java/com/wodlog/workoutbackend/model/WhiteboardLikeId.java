package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class WhiteboardLikeId implements Serializable {

  @Column(name = "post_id")
  private UUID postId;

  @Column(name = "user_id")
  private UUID userId;

  public WhiteboardLikeId() {}

  public WhiteboardLikeId(UUID postId, UUID userId) {
    this.postId = postId;
    this.userId = userId;
  }

  public UUID getPostId() {
    return postId;
  }

  public void setPostId(UUID postId) {
    this.postId = postId;
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
    if (!(o instanceof WhiteboardLikeId that)) {
      return false;
    }
    return Objects.equals(postId, that.postId) && Objects.equals(userId, that.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(postId, userId);
  }
}
