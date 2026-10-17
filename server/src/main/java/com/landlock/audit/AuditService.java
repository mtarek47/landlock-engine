package com.landlock.audit;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditEventRepository auditEventRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordEvent(
            UUID actorId,
            UUID institutionId,
            String action,
            String entityType,
            UUID entityId,
            String reason,
            String changeSummary
    ) {
        recordEvent(actorId, institutionId, action, entityType, entityId, reason, changeSummary, UUID.randomUUID().toString());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordEvent(
            UUID actorId,
            UUID institutionId,
            String action,
            String entityType,
            UUID entityId,
            String reason,
            String changeSummary,
            String correlationId
    ) {
        try {
            AuditEvent event = AuditEvent.builder()
                    .actorUserId(actorId)
                    .institutionId(institutionId)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .reason(reason)
                    .correlationId(correlationId)
                    .occurredAt(Instant.now())
                    .changeSummary(changeSummary)
                    .build();

            auditEventRepository.save(event);
            log.info("Audit logged: action={}, entityType={}, entityId={}, actorId={}", action, entityType, entityId, actorId);
        } catch (Exception ex) {
            log.error("Failed to persist audit event for action: {}", action, ex);
        }
    }

    @Transactional(readOnly = true)
    public Page<AuditEventDTO> getEvents(Pageable pageable) {
        return auditEventRepository.findAllByOrderByOccurredAtDesc(pageable)
                .map(AuditEventDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<AuditEventDTO> getEventsByEntity(String entityType, UUID entityId) {
        return auditEventRepository.findByEntityTypeAndEntityIdOrderByOccurredAtDesc(entityType, entityId).stream()
                .map(AuditEventDTO::fromEntity)
                .toList();
    }
}
