package com.dkp.services;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ServiceEnquiryRepository extends JpaRepository<ServiceEnquiry, Long> {

    Optional<ServiceEnquiry> findByReferenceId(String referenceId);
}
