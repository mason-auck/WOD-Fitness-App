package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.SkillLevelEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillLevelRepository extends JpaRepository<SkillLevelEntity, Integer> {

  List<SkillLevelEntity> findAllByOrderByLevelAsc();
}
