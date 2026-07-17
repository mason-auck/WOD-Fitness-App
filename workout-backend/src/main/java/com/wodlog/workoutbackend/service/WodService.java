package com.wodlog.workoutbackend.service;

import com.wodlog.workoutbackend.dto.request.CreateWodRequest;
import com.wodlog.workoutbackend.dto.response.ActivityLogDto;
import com.wodlog.workoutbackend.dto.response.WodDto;
import com.wodlog.workoutbackend.exception.ApiException;
import com.wodlog.workoutbackend.model.UserWodFavorite;
import com.wodlog.workoutbackend.model.UserWodFavoriteId;
import com.wodlog.workoutbackend.model.Wod;
import com.wodlog.workoutbackend.repository.ActivityLogRepository;
import com.wodlog.workoutbackend.repository.UserWodFavoriteRepository;
import com.wodlog.workoutbackend.repository.WodRepository;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class WodService {

  private final WodRepository wodRepository;
  private final UserWodFavoriteRepository favoriteRepository;
  private final ActivityLogRepository activityLogRepository;
  private final ProfileService profileService;

  public WodService(
      WodRepository wodRepository,
      UserWodFavoriteRepository favoriteRepository,
      ActivityLogRepository activityLogRepository,
      ProfileService profileService) {
    this.wodRepository = wodRepository;
    this.favoriteRepository = favoriteRepository;
    this.activityLogRepository = activityLogRepository;
    this.profileService = profileService;
  }

  @Transactional(readOnly = true)
  public List<WodDto> list(
      UUID userId, String q, String type, String category, boolean favoritesOnly) {
    profileService.requireProfile(userId);
    String query = StringUtils.hasText(q) ? q.trim() : null;
    List<Wod> wods = wodRepository.search(userId, query, type, category, favoritesOnly);
    Set<UUID> favoriteIds =
        favoriteRepository.findFavoriteWodIds(userId, wods.stream().map(Wod::getId).toList());
    return wods.stream().map(wod -> toDto(wod, favoriteIds.contains(wod.getId()))).toList();
  }

  @Transactional(readOnly = true)
  public WodDto get(UUID userId, UUID wodId) {
    profileService.requireProfile(userId);
    Wod wod = requireWod(wodId);
    boolean favorited = favoriteRepository.existsByIdUserIdAndIdWodId(userId, wodId);
    return toDto(wod, favorited);
  }

  @Transactional
  public WodDto create(UUID userId, CreateWodRequest request) {
    profileService.requireProfile(userId);
    Wod wod = new Wod();
    wod.setTitle(request.title().trim());
    wod.setType(request.type());
    wod.setDescription(request.description() == null ? "" : request.description().trim());
    wod.setCategory("Custom");
    wod.setSource("user");
    wod.setCreatedBy(userId);
    Wod saved = wodRepository.save(wod);
    return toDto(saved, false);
  }

  @Transactional
  public void favorite(UUID userId, UUID wodId) {
    profileService.requireProfile(userId);
    requireWod(wodId);
    UserWodFavoriteId id = new UserWodFavoriteId(userId, wodId);
    if (favoriteRepository.existsById(id)) {
      return;
    }
    UserWodFavorite favorite = new UserWodFavorite();
    favorite.setId(id);
    favoriteRepository.save(favorite);
  }

  @Transactional
  public void unfavorite(UUID userId, UUID wodId) {
    profileService.requireProfile(userId);
    favoriteRepository.deleteById(new UserWodFavoriteId(userId, wodId));
  }

  @Transactional(readOnly = true)
  public List<ActivityLogDto> history(UUID userId, UUID wodId) {
    profileService.requireProfile(userId);
    requireWod(wodId);
    return activityLogRepository
        .findByUserIdAndWodIdOrderByLoggedOnDescCreatedAtDesc(userId, wodId)
        .stream()
        .map(ActivityLogService::toDto)
        .toList();
  }

  public Wod requireWod(UUID wodId) {
    return wodRepository
        .findById(wodId)
        .orElseThrow(() -> ApiException.notFound("WOD not found"));
  }

  private WodDto toDto(Wod wod, boolean favorited) {
    return new WodDto(
        wod.getId(),
        wod.getTitle(),
        wod.getType(),
        wod.getCategory(),
        wod.getDescription(),
        favorited,
        "user".equals(wod.getSource()),
        wod.getSource());
  }
}
