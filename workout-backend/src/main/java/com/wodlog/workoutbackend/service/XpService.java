package com.wodlog.workoutbackend.service;

import com.wodlog.workoutbackend.model.XpEvent;
import com.wodlog.workoutbackend.repository.XpEventRepository;
import com.wodlog.workoutbackend.support.XpConstants;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class XpService {

  private final XpEventRepository xpEventRepository;

  public XpService(XpEventRepository xpEventRepository) {
    this.xpEventRepository = xpEventRepository;
  }

  @Transactional
  public void awardIfAbsent(UUID userId, String source, UUID sourceId, int xp) {
    if (xpEventRepository.existsBySourceAndSourceId(source, sourceId)) {
      return;
    }
    XpEvent event = new XpEvent();
    event.setUserId(userId);
    event.setSource(source);
    event.setSourceId(sourceId);
    event.setXp(xp);
    xpEventRepository.save(event);
  }

  @Transactional(readOnly = true)
  public long totalXp(UUID userId) {
    return xpEventRepository.sumXpByUserId(userId);
  }

  public void awardWodLog(UUID userId, UUID activityLogId) {
    awardIfAbsent(userId, XpConstants.SOURCE_WOD_LOG, activityLogId, XpConstants.XP_PER_WOD);
  }

  public void awardPrLog(UUID userId, UUID prEntryId) {
    awardIfAbsent(userId, XpConstants.SOURCE_PR_LOG, prEntryId, XpConstants.XP_PER_PR);
  }
}
