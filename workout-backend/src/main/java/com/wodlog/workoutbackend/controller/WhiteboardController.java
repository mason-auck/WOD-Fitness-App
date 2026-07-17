package com.wodlog.workoutbackend.controller;

import com.wodlog.workoutbackend.dto.request.CreateCommentRequest;
import com.wodlog.workoutbackend.dto.request.CreateWhiteboardPostRequest;
import com.wodlog.workoutbackend.dto.response.WhiteboardCommentDto;
import com.wodlog.workoutbackend.dto.response.WhiteboardPostDto;
import com.wodlog.workoutbackend.security.CurrentUser;
import com.wodlog.workoutbackend.service.WhiteboardService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/whiteboard")
public class WhiteboardController {

  private final WhiteboardService whiteboardService;

  public WhiteboardController(WhiteboardService whiteboardService) {
    this.whiteboardService = whiteboardService;
  }

  @GetMapping
  public List<WhiteboardPostDto> feed(
      @RequestParam(required = false) String q,
      @RequestParam(required = false) String visibility) {
    return whiteboardService.feed(CurrentUser.id(), q, visibility);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public WhiteboardPostDto create(@Valid @RequestBody CreateWhiteboardPostRequest request) {
    return whiteboardService.create(CurrentUser.id(), request);
  }

  @PostMapping("/{id}/likes")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void like(@PathVariable UUID id) {
    whiteboardService.like(CurrentUser.id(), id);
  }

  @DeleteMapping("/{id}/likes")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void unlike(@PathVariable UUID id) {
    whiteboardService.unlike(CurrentUser.id(), id);
  }

  @GetMapping("/{id}/comments")
  public List<WhiteboardCommentDto> comments(@PathVariable UUID id) {
    return whiteboardService.comments(CurrentUser.id(), id);
  }

  @PostMapping("/{id}/comments")
  @ResponseStatus(HttpStatus.CREATED)
  public WhiteboardCommentDto addComment(
      @PathVariable UUID id, @Valid @RequestBody CreateCommentRequest request) {
    return whiteboardService.addComment(CurrentUser.id(), id, request);
  }
}
