package com.landlock.order;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "court_orders")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(name = "order_reference", nullable = false, length = 200)
    private String orderReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", nullable = false, length = 50)
    private OrderType orderType;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_until")
    private LocalDate effectiveUntil;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_scope", nullable = false, length = 50)
    @Builder.Default
    private TransactionType transactionScope = TransactionType.ALL;

    @Column(name = "source_document_reference", length = 500)
    private String sourceDocumentReference;

    @Column(name = "verification_status", nullable = false, length = 30)
    @Builder.Default
    private String verificationStatus = "PENDING";

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 30)
    @Builder.Default
    private OrderStatus approvalStatus = OrderStatus.DRAFT;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "supersedes_order_id")
    private UUID supersedesOrderId;

    @Column(name = "created_by")
    private UUID createdBy;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
