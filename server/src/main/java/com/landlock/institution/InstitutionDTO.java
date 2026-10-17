package com.landlock.institution;

import java.time.Instant;
import java.util.UUID;

public record InstitutionDTO(
    UUID id,
    String name,
    InstitutionType institutionType,
    String externalReference,
    String status,
    Instant createdAt
) {
    public static InstitutionDTO fromEntity(Institution institution) {
        if (institution == null) {
            return null;
        }
        return new InstitutionDTO(
                institution.getId(),
                institution.getName(),
                institution.getInstitutionType(),
                institution.getExternalReference(),
                institution.getStatus(),
                institution.getCreatedAt()
        );
    }
}
