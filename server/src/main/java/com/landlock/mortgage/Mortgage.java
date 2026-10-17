package com.landlock.mortgage;

import com.landlock.common.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "mortgages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mortgage extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "parcel_id", nullable = false)
    private UUID parcelId;

    @Column(name = "lender_institution_id", nullable = false)
    private UUID lenderInstitutionId;

    @Column(name = "lender_reference", nullable = false, length = 200)
    private String lenderReference;

    @Column(name = "scope_type", nullable = false, length = 50)
    @Builder.Default
    private String scopeType = "FULL_PARCEL";

    @Column(name = "secured_area", precision = 15, scale = 4)
    private BigDecimal securedArea;

    @Column(name = "secured_share", length = 50)
    private String securedShare;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_until")
    private LocalDate effectiveUntil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private MortgageStatus status = MortgageStatus.ACTIVE;

    @Column(name = "release_reference", length = 500)
    private String releaseReference;

    @Column(name = "created_by")
    private UUID createdBy;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Integer version = 0;
}
