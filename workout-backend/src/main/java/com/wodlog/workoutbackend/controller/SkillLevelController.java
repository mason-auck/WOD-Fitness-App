package com.wodlog.workoutbackend.controller;

import com.wodlog.workoutbackend.dto.response.SkillLevelDto;
import com.wodlog.workoutbackend.service.SkillService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/skill-levels")
public class SkillLevelController {

  private final SkillService skillService;

  public SkillLevelController(SkillService skillService) {
    this.skillService = skillService;
  }

  @GetMapping
  public List<SkillLevelDto> list() {
    return skillService.listLevels();
  }
}
