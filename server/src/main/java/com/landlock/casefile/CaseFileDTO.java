package com.landlock.casefile;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public record CaseFileDTO(
    UUID id,
    String caseNumber,
    UUID courtInstitutionId,
    CaseType caseType,
    LocalDate filingDate,
    CaseStatus caseStatus,
    String restrictedSummary,
    String sourceReference,
    UUID createdBy,
    Instant createdAt,
    List<UUID> parcelIds
) {
    public static CaseFileDTO fromEntity(CaseFile caseFile, List<UUID> parcelIds) {
        if (caseFile == null) {
            return null;
        }
        return new CaseFileDTO(
                caseFile.getId(),
                caseFile.getCaseNumber(),
                caseFile.getCourtInstitutionId(),
                caseFile.getCaseType(),
                caseFile.getFilingDate(),
                caseFile.getCaseStatus(),
                caseFile.getRestrictedSummary(),
                caseFile.getSourceReference(),
                caseFile.getCreatedBy(),
                caseFile.getCreatedAt(),
                parcelIds != null ? parcelIds : Collections.emptyList()
        );
    }
}
