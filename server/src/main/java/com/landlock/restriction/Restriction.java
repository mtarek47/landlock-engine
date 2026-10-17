package com.landlock.restriction;

import com.landlock.common.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "restrictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restriction extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "parcel_id", nullable = false)
    private UUID parcelId;

    @Column(name = "case_id")
    private UUID caseId;

    @Column(name = "court_order_id")
    private UUID courtOrderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "restriction_type", nullable = false, length = 50)
    private RestrictionType restrictionType;

    @Column(name = "scope_type", nullable = false, length = 50)
    @Builder.Default
    private String scopeType = "FULL_PARCEL";

    @Column(name = "scope_area", precision = 15, scale = 4)
    private BigDecimal scopeArea;

    @Column(name = "scope_share", length = 50)
    private String scopeShare;

    @Column(name = "applicable_transaction_types", nullable = false, length = 200)
    @Builder.Default
    private String applicableTransactionTypes = "ALL";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private RestrictionStatus status = RestrictionStatus.DRAFT;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_until")
    private LocalDate effectiveUntil;

    @Column(name = "source_reference", length = 500)
    private String sourceReference;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Integer version = 0;
}
