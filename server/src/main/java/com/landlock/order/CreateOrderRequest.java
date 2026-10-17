package com.landlock.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record CreateOrderRequest(
    @NotNull(message = "Case ID is required")
    UUID caseId,

    @NotBlank(message = "Order reference is required")
    String orderReference,

    @NotNull(message = "Order type is required")
    OrderType orderType,

    @NotNull(message = "Order date is required")
    LocalDate orderDate,

    @NotNull(message = "Effective from date is required")
    LocalDate effectiveFrom,

    LocalDate effectiveUntil,

    TransactionType transactionScope,

    String sourceDocumentReference,

    UUID supersedesOrderId
) {}
