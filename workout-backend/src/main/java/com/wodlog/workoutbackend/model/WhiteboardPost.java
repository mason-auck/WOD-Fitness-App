package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "whiteboard_posts")
public class WhiteboardPost {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "author_id", nullable = false)
  private UUID authorId;

  @Column(name = "wod_id")
  private UUID wodId;

  @Column(name = "wod_title", nullable = false)
  private String wodTitle;

  @Column(name = "wod_type", nullable = false)
  private String wodType;

  @Column(nullable = false)
  private String score;

  private String notes;

  private String caption;

  @Column(nullable = false)
  private String visibility;

  @Column(name = "gym_id")
  private UUID gymId;

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

  public UUID getAuthorId() {
    return authorId;
  }

  public void setAuthorId(UUID authorId) {
    this.authorId = authorId;
  }

  public UUID getWodId() {
    return wodId;
  }

  public void setWodId(UUID wodId) {
    this.wodId = wodId;
  }

  public String getWodTitle() {
    return wodTitle;
  }

  public void setWodTitle(String wodTitle) {
    this.wodTitle = wodTitle;
  }

  public String getWodType() {
    return wodType;
  }

  public void setWodType(String wodType) {
    this.wodType = wodType;
  }

  public String getScore() {
    return score;
  }

  public void setScore(String score) {
    this.score = score;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public String getCaption() {
    return caption;
  }

  public void setCaption(String caption) {
    this.caption = caption;
  }

  public String getVisibility() {
    return visibility;
  }

  public void setVisibility(String visibility) {
    this.visibility = visibility;
  }

  public UUID getGymId() {
    return gymId;
  }

  public void setGymId(UUID gymId) {
    this.gymId = gymId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
