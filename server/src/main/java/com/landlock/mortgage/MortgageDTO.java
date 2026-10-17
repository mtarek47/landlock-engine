package com.landlock.mortgage;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record MortgageDTO(
    UUID id,
    UUID parcelId,
    UUID lenderInstitutionId,
    String lenderReference,
    String scopeType,
    BigDecimal securedArea,
    String securedShare,
    LocalDate effectiveFrom,
    LocalDate effectiveUntil,
    MortgageStatus status,
    String releaseReference,
    UUID createdBy,
    Integer version,
    Instant createdAt,
    Instant updatedAt
) {
    public static MortgageDTO fromEntity(Mortgage mortgage) {
        if (mortgage == null) {
            return null;
        }
        return new MortgageDTO(
                mortgage.getId(),
                mortgage.getParcelId(),
                mortgage.getLenderInstitutionId(),
                mortgage.getLenderReference(),
                mortgage.getScopeType(),
                mortgage.getSecuredArea(),
                mortgage.getSecuredShare(),
                mortgage.getEffectiveFrom(),
                mortgage.getEffectiveUntil(),
                mortgage.getStatus(),
                mortgage.getReleaseReference(),
                mortgage.getCreatedBy(),
                mortgage.getVersion(),
                mortgage.getCreatedAt(),
                mortgage.getUpdatedAt()
        );
    }
}
