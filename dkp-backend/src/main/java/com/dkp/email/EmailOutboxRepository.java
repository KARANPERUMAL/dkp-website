package com.dkp.email;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface EmailOutboxRepository extends JpaRepository<EmailOutbox, Long> {

    @Query("SELECT e FROM EmailOutbox e WHERE e.status IN :statuses AND e.nextAttemptAt <= :now ORDER BY e.nextAttemptAt ASC")
    List<EmailOutbox> findDueEvents(
            @Param("statuses") List<EmailOutboxStatus> statuses,
            @Param("now") Instant now,
            Pageable pageable
    );

    List<EmailOutbox> findByReferenceId(String referenceId);
}
