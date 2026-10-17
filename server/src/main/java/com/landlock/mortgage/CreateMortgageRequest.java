package com.landlock.mortgage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateMortgageRequest(
    @NotNull(message = "Parcel ID is required")
    UUID parcelId,

    UUID lenderInstitutionId,

    @NotBlank(message = "Lender reference / deed number is required")
    String lenderReference,

    String scopeType,

    BigDecimal securedArea,

    String securedShare,

    @NotNull(message = "Effective from date is required")
    LocalDate effectiveFrom,

    LocalDate effectiveUntil
) {}
