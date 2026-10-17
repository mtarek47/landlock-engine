package com.landlock.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {
    List<AuditEvent> findByEntityTypeAndEntityIdOrderByOccurredAtDesc(String entityType, UUID entityId);
    List<AuditEvent> findByActorUserIdOrderByOccurredAtDesc(UUID actorUserId);
    Page<AuditEvent> findAllByOrderByOccurredAtDesc(Pageable pageable);
}
