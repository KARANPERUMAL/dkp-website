package com.dkp.careers;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    Optional<JobApplication> findByReferenceId(String referenceId);

    boolean existsByEmailAndPositionAndStatus(String email, String position, String status);
}
