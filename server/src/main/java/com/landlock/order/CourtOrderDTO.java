package com.landlock.order;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record CourtOrderDTO(
    UUID id,
    UUID caseId,
    String orderReference,
    OrderType orderType,
    LocalDate orderDate,
    LocalDate effectiveFrom,
    LocalDate effectiveUntil,
    TransactionType transactionScope,
    String sourceDocumentReference,
    String verificationStatus,
    OrderStatus approvalStatus,
    UUID approvedBy,
    Instant approvedAt,
    UUID supersedesOrderId,
    UUID createdBy,
    Instant createdAt
) {
    public static CourtOrderDTO fromEntity(CourtOrder order) {
        if (order == null) {
            return null;
        }
        return new CourtOrderDTO(
                order.getId(),
                order.getCaseId(),
                order.getOrderReference(),
                order.getOrderType(),
                order.getOrderDate(),
                order.getEffectiveFrom(),
                order.getEffectiveUntil(),
                order.getTransactionScope(),
                order.getSourceDocumentReference(),
                order.getVerificationStatus(),
                order.getApprovalStatus(),
                order.getApprovedBy(),
                order.getApprovedAt(),
                order.getSupersedesOrderId(),
                order.getCreatedBy(),
                order.getCreatedAt()
        );
    }
}
