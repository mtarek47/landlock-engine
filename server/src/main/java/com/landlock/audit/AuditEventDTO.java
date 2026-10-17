package com.landlock.audit;

import java.time.Instant;
import java.util.UUID;

public record AuditEventDTO(
    UUID id,
    UUID actorUserId,
    UUID institutionId,
    String action,
    String entityType,
    UUID entityId,
    String reason,
    String correlationId,
    Instant occurredAt,
    String changeSummary
) {
    public static AuditEventDTO fromEntity(AuditEvent event) {
        if (event == null) {
            return null;
        }
        return new AuditEventDTO(
                event.getId(),
                event.getActorUserId(),
                event.getInstitutionId(),
                event.getAction(),
                event.getEntityType(),
                event.getEntityId(),
                event.getReason(),
                event.getCorrelationId(),
                event.getOccurredAt(),
                event.getChangeSummary()
        );
    }
}
