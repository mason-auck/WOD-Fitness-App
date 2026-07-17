package com.wodlog.workoutbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "skill_levels")
public class SkillLevelEntity {

  @Id
  private Integer level;

  @Column(nullable = false)
  private String title;

  @Column(name = "xp_required", nullable = false)
  private int xpRequired;

  public Integer getLevel() {
    return level;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public int getXpRequired() {
    return xpRequired;
  }

  public void setXpRequired(int xpRequired) {
    this.xpRequired = xpRequired;
  }
}
