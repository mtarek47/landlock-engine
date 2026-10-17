package com.landlock.casefile;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record AddCaseParcelRequest(
    @NotNull(message = "Parcel ID is required")
    UUID parcelId,

    String scopeType,

    BigDecimal scopeArea,

    String scopeShare
) {}
