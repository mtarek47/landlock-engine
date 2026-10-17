package com.landlock.restriction;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateRestrictionRequest(
    @NotNull(message = "Parcel ID is required")
    UUID parcelId,

    UUID caseId,

    UUID courtOrderId,

    @NotNull(message = "Restriction type is required")
    RestrictionType restrictionType,

    String scopeType,

    BigDecimal scopeArea,

    String scopeShare,

    String applicableTransactionTypes,

    @NotNull(message = "Effective from date is required")
    LocalDate effectiveFrom,

    LocalDate effectiveUntil,

    String sourceReference
) {}
