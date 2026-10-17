package com.landlock.casefile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreateCaseRequest(
    @NotBlank(message = "Case number is required")
    String caseNumber,

    UUID courtInstitutionId,

    @NotNull(message = "Case type is required")
    CaseType caseType,

    @NotNull(message = "Filing date is required")
    LocalDate filingDate,

    String restrictedSummary,

    String sourceReference,

    List<UUID> initialParcelIds
) {}
