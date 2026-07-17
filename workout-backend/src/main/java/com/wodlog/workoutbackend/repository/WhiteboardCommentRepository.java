package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.WhiteboardComment;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WhiteboardCommentRepository extends JpaRepository<WhiteboardComment, UUID> {

  List<WhiteboardComment> findByPostIdOrderByCreatedAtAsc(UUID postId);

  List<WhiteboardComment> findByPostIdInOrderByCreatedAtAsc(Collection<UUID> postIds);
}
