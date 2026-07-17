package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "pr_entries")
public class PrEntry {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "exercise_id", nullable = false)
  private UUID exerciseId;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(nullable = false)
  private String value;

  @Column(name = "logged_on", nullable = false)
  private LocalDate loggedOn;

  private String notes;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    createdAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UUID getExerciseId() {
    return exerciseId;
  }

  public void setExerciseId(UUID exerciseId) {
    this.exerciseId = exerciseId;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public LocalDate getLoggedOn() {
    return loggedOn;
  }

  public void setLoggedOn(LocalDate loggedOn) {
    this.loggedOn = loggedOn;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
