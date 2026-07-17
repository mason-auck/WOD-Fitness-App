package com.wodlog.workoutbackend.controller;

import com.wodlog.workoutbackend.dto.response.GymDto;
import com.wodlog.workoutbackend.security.CurrentUser;
import com.wodlog.workoutbackend.service.GymService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gyms")
public class GymController {

  private final GymService gymService;

  public GymController(GymService gymService) {
    this.gymService = gymService;
  }

  @GetMapping
  public List<GymDto> listMine() {
    return gymService.listMine(CurrentUser.id());
  }
}
