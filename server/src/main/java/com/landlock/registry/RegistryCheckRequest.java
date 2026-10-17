package com.landlock.registry;

import com.landlock.order.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record RegistryCheckRequest(
    @NotBlank(message = "requestId (idempotency key) is required")
    String requestId,

    UUID parcelId,

    String divisionCode,
    String districtCode,
    String upazilaCode,
    String mouzaCode,
    String dagNumber,
    String khatianNumber,

    @NotNull(message = "transactionType is required")
    TransactionType transactionType
) {}
