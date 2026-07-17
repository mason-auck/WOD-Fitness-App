package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "gym_members")
public class GymMember {

  @EmbeddedId
  private GymMemberId id;

  @Column(nullable = false)
  private String role = "member";

  @Column(name = "joined_at", nullable = false)
  private Instant joinedAt;

  @PrePersist
  void onCreate() {
    joinedAt = Instant.now();
  }

  public GymMemberId getId() {
    return id;
  }

  public void setId(GymMemberId id) {
    this.id = id;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public Instant getJoinedAt() {
    return joinedAt;
  }
}
