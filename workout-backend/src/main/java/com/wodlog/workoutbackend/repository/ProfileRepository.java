package com.wodlog.workoutbackend.repository;

import com.wodlog.workoutbackend.model.Profile;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {

  Optional<Profile> findByUsernameIgnoreCase(String username);

  boolean existsByUsernameIgnoreCaseAndIdNot(String username, UUID id);

  List<Profile> findByIdIn(Collection<UUID> ids);
}
