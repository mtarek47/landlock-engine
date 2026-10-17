package com.landlock.restriction;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record RestrictionDTO(
    UUID id,
    UUID parcelId,
    UUID caseId,
    UUID courtOrderId,
    RestrictionType restrictionType,
    String scopeType,
    BigDecimal scopeArea,
    String scopeShare,
    String applicableTransactionTypes,
    RestrictionStatus status,
    LocalDate effectiveFrom,
    LocalDate effectiveUntil,
    String sourceReference,
    UUID createdBy,
    UUID approvedBy,
    Integer version,
    Instant createdAt,
    Instant updatedAt
) {
    public static RestrictionDTO fromEntity(Restriction restriction) {
        if (restriction == null) {
            return null;
        }
        return new RestrictionDTO(
                restriction.getId(),
                restriction.getParcelId(),
                restriction.getCaseId(),
                restriction.getCourtOrderId(),
                restriction.getRestrictionType(),
                restriction.getScopeType(),
                restriction.getScopeArea(),
                restriction.getScopeShare(),
                restriction.getApplicableTransactionTypes(),
                restriction.getStatus(),
                restriction.getEffectiveFrom(),
                restriction.getEffectiveUntil(),
                restriction.getSourceReference(),
                restriction.getCreatedBy(),
                restriction.getApprovedBy(),
                restriction.getVersion(),
                restriction.getCreatedAt(),
                restriction.getUpdatedAt()
        );
    }
}
