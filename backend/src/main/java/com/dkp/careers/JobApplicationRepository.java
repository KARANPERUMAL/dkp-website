package com.dkp.careers;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    Optional<JobApplication> findByReferenceId(String referenceId);

    List<JobApplication> findByEmailOrderByCreatedAtDesc(String email);

    boolean existsByEmailAndPositionAndStatus(String email, String position, String status);
}
