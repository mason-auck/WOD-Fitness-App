package com.wodlog.workoutbackend.service;

import com.wodlog.workoutbackend.dto.request.CreateCommentRequest;
import com.wodlog.workoutbackend.dto.request.CreateWhiteboardPostRequest;
import com.wodlog.workoutbackend.dto.response.WhiteboardCommentDto;
import com.wodlog.workoutbackend.dto.response.WhiteboardPostDto;
import com.wodlog.workoutbackend.exception.ApiException;
import com.wodlog.workoutbackend.model.Profile;
import com.wodlog.workoutbackend.model.WhiteboardComment;
import com.wodlog.workoutbackend.model.WhiteboardLike;
import com.wodlog.workoutbackend.model.WhiteboardLikeId;
import com.wodlog.workoutbackend.model.WhiteboardPost;
import com.wodlog.workoutbackend.repository.ProfileRepository;
import com.wodlog.workoutbackend.repository.WhiteboardCommentRepository;
import com.wodlog.workoutbackend.repository.WhiteboardLikeRepository;
import com.wodlog.workoutbackend.repository.WhiteboardPostRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class WhiteboardService {

  private final WhiteboardPostRepository postRepository;
  private final WhiteboardLikeRepository likeRepository;
  private final WhiteboardCommentRepository commentRepository;
  private final ProfileRepository profileRepository;
  private final ProfileService profileService;
  private final GymService gymService;

  public WhiteboardService(
      WhiteboardPostRepository postRepository,
      WhiteboardLikeRepository likeRepository,
      WhiteboardCommentRepository commentRepository,
      ProfileRepository profileRepository,
      ProfileService profileService,
      GymService gymService) {
    this.postRepository = postRepository;
    this.likeRepository = likeRepository;
    this.commentRepository = commentRepository;
    this.profileRepository = profileRepository;
    this.profileService = profileService;
    this.gymService = gymService;
  }

  @Transactional(readOnly = true)
  public List<WhiteboardPostDto> feed(UUID userId, String q, String visibility) {
    profileService.requireProfile(userId);
    List<UUID> gymIds = gymService.memberGymIds(userId);
    // JPQL IN () with empty collection can fail — use a sentinel UUID that never matches.
    if (gymIds.isEmpty()) {
      gymIds = List.of(UUID.fromString("00000000-0000-0000-0000-000000000000"));
    }
    String query = StringUtils.hasText(q) ? q.trim() : null;
    List<WhiteboardPost> posts = postRepository.findFeed(gymIds, query, visibility);
    return mapPosts(userId, posts);
  }

  @Transactional
  public WhiteboardPostDto create(UUID userId, CreateWhiteboardPostRequest request) {
    profileService.requireProfile(userId);
    String visibility = request.visibility().trim().toLowerCase();
    if (!visibility.equals("public") && !visibility.equals("gym")) {
      throw ApiException.badRequest("visibility must be 'public' or 'gym'");
    }

    WhiteboardPost post = new WhiteboardPost();
    post.setAuthorId(userId);
    post.setWodId(request.wodId());
    post.setWodTitle(request.wodTitle().trim());
    post.setWodType(request.wodType());
    post.setScore(request.score().trim());
    post.setNotes(blankToNull(request.notes()));
    post.setCaption(blankToNull(request.caption()));
    post.setVisibility(visibility);

    if (visibility.equals("gym")) {
      if (request.gymId() == null) {
        throw ApiException.badRequest("gymId is required for gym visibility");
      }
      gymService.requireGym(request.gymId());
      gymService.requireMembership(userId, request.gymId());
      post.setGymId(request.gymId());
    } else {
      post.setGymId(null);
    }

    WhiteboardPost saved = postRepository.save(post);
    return mapPosts(userId, List.of(saved)).getFirst();
  }

  @Transactional
  public void like(UUID userId, UUID postId) {
    profileService.requireProfile(userId);
    requireVisiblePost(userId, postId);
    WhiteboardLikeId id = new WhiteboardLikeId(postId, userId);
    if (likeRepository.existsById(id)) {
      return;
    }
    WhiteboardLike like = new WhiteboardLike();
    like.setId(id);
    likeRepository.save(like);
  }

  @Transactional
  public void unlike(UUID userId, UUID postId) {
    profileService.requireProfile(userId);
    likeRepository.deleteById(new WhiteboardLikeId(postId, userId));
  }

  @Transactional(readOnly = true)
  public List<WhiteboardCommentDto> comments(UUID userId, UUID postId) {
    profileService.requireProfile(userId);
    requireVisiblePost(userId, postId);
    List<WhiteboardComment> comments =
        commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    return mapComments(comments);
  }

  @Transactional
  public WhiteboardCommentDto addComment(
      UUID userId, UUID postId, CreateCommentRequest request) {
    profileService.requireProfile(userId);
    requireVisiblePost(userId, postId);

    WhiteboardComment comment = new WhiteboardComment();
    comment.setPostId(postId);
    comment.setAuthorId(userId);
    comment.setBody(request.body().trim());
    WhiteboardComment saved = commentRepository.save(comment);
    return mapComments(List.of(saved)).getFirst();
  }

  private WhiteboardPost requireVisiblePost(UUID userId, UUID postId) {
    WhiteboardPost post =
        postRepository
            .findById(postId)
            .orElseThrow(() -> ApiException.notFound("Whiteboard post not found"));
    if ("public".equals(post.getVisibility())) {
      return post;
    }
    if (post.getGymId() != null
        && gymService.memberGymIds(userId).contains(post.getGymId())) {
      return post;
    }
    throw ApiException.forbidden("You cannot access this whiteboard post");
  }

  private List<WhiteboardPostDto> mapPosts(UUID userId, List<WhiteboardPost> posts) {
    if (posts.isEmpty()) {
      return List.of();
    }

    Set<UUID> postIds = posts.stream().map(WhiteboardPost::getId).collect(Collectors.toSet());
    Set<UUID> authorIds = new HashSet<>();
    posts.forEach(post -> authorIds.add(post.getAuthorId()));

    List<WhiteboardComment> allComments =
        commentRepository.findByPostIdInOrderByCreatedAtAsc(postIds);
    allComments.forEach(comment -> authorIds.add(comment.getAuthorId()));

    Map<UUID, String> displayNames =
        profileRepository.findByIdIn(authorIds).stream()
            .collect(Collectors.toMap(Profile::getId, Profile::getDisplayName));

    Set<UUID> liked =
        likeRepository.findLikedPostIds(userId, postIds);

    Map<UUID, List<WhiteboardComment>> commentsByPost = new HashMap<>();
    for (WhiteboardComment comment : allComments) {
      commentsByPost
          .computeIfAbsent(comment.getPostId(), ignored -> new ArrayList<>())
          .add(comment);
    }

    return posts.stream()
        .map(
            post -> {
              List<WhiteboardComment> comments =
                  commentsByPost.getOrDefault(post.getId(), List.of());
              long likes = likeRepository.countByIdPostId(post.getId());
              return new WhiteboardPostDto(
                  post.getId(),
                  displayNames.getOrDefault(post.getAuthorId(), "Athlete"),
                  post.getAuthorId(),
                  post.getWodTitle(),
                  post.getWodType(),
                  post.getScore(),
                  post.getNotes(),
                  post.getCaption(),
                  post.getCreatedAt(),
                  likes,
                  liked.contains(post.getId()),
                  comments.stream()
                      .map(
                          c ->
                              new WhiteboardCommentDto(
                                  c.getId(),
                                  displayNames.getOrDefault(c.getAuthorId(), "Athlete"),
                                  c.getAuthorId(),
                                  c.getBody(),
                                  c.getCreatedAt()))
                      .toList(),
                  post.getVisibility(),
                  post.getGymId());
            })
        .toList();
  }

  private List<WhiteboardCommentDto> mapComments(List<WhiteboardComment> comments) {
    if (comments.isEmpty()) {
      return List.of();
    }
    Set<UUID> authorIds =
        comments.stream().map(WhiteboardComment::getAuthorId).collect(Collectors.toSet());
    Map<UUID, String> displayNames =
        profileRepository.findByIdIn(authorIds).stream()
            .collect(Collectors.toMap(Profile::getId, Profile::getDisplayName));
    return comments.stream()
        .map(
            c ->
                new WhiteboardCommentDto(
                    c.getId(),
                    displayNames.getOrDefault(c.getAuthorId(), "Athlete"),
                    c.getAuthorId(),
                    c.getBody(),
                    c.getCreatedAt()))
        .toList();
  }

  private static String blankToNull(String value) {
    return StringUtils.hasText(value) ? value.trim() : null;
  }
}
