package com.landlock.registry;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "registry_checks", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"request_id", "requesting_institution_id"})
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistryCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "request_id", nullable = false, length = 200)
    private String requestId;

    @Column(name = "requesting_institution_id", nullable = false)
    private UUID requestingInstitutionId;

    @Column(name = "parcel_id")
    private UUID parcelId;

    @Column(name = "transaction_type", nullable = false, length = 50)
    private String transactionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private RegistryDecision decision;

    @Column(name = "reason_codes", columnDefinition = "TEXT")
    private String reasonCodes;

    @Column(name = "data_freshness")
    private Instant dataFreshness;

    @Column(name = "correlation_id", length = 100)
    private String correlationId;

    @CreatedDate
    @Column(name = "checked_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant checkedAt = Instant.now();

    @Column(name = "response_summary", columnDefinition = "TEXT")
    private String responseSummary;
}
