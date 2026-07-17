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
@Table(name = "activity_logs")
public class ActivityLog {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(nullable = false)
  private String kind;

  @Column(name = "logged_on", nullable = false)
  private LocalDate loggedOn;

  @Column(name = "wod_id")
  private UUID wodId;

  @Column(name = "exercise_id")
  private UUID exerciseId;

  @Column(nullable = false)
  private String title;

  @Column(name = "wod_type")
  private String wodType;

  @Column(nullable = false)
  private String result;

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

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public String getKind() {
    return kind;
  }

  public void setKind(String kind) {
    this.kind = kind;
  }

  public LocalDate getLoggedOn() {
    return loggedOn;
  }

  public void setLoggedOn(LocalDate loggedOn) {
    this.loggedOn = loggedOn;
  }

  public UUID getWodId() {
    return wodId;
  }

  public void setWodId(UUID wodId) {
    this.wodId = wodId;
  }

  public UUID getExerciseId() {
    return exerciseId;
  }

  public void setExerciseId(UUID exerciseId) {
    this.exerciseId = exerciseId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getWodType() {
    return wodType;
  }

  public void setWodType(String wodType) {
    this.wodType = wodType;
  }

  public String getResult() {
    return result;
  }

  public void setResult(String result) {
    this.result = result;
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
