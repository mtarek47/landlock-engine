package com.landlock.restriction;

import com.landlock.audit.AuditService;
import com.landlock.order.TransactionType;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RestrictionService {

    private static final Logger log = LoggerFactory.getLogger(RestrictionService.class);

    private final RestrictionRepository restrictionRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<RestrictionDTO> getRestrictionsByParcel(UUID parcelId) {
        return restrictionRepository.findByParcelId(parcelId).stream()
                .map(RestrictionDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public RestrictionDTO getRestrictionById(UUID id) {
        Restriction restriction = restrictionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restriction not found with id: " + id));
        return RestrictionDTO.fromEntity(restriction);
    }

    @Transactional(readOnly = true)
    public List<Restriction> findActiveRestrictionsForTransaction(UUID parcelId, TransactionType transactionType) {
        List<Restriction> activeRestrictions = restrictionRepository.findByParcelIdAndStatus(parcelId, RestrictionStatus.ACTIVE);
        LocalDate today = LocalDate.now();

        return activeRestrictions.stream()
                .filter(r -> {
                    // Check date validity
                    if (r.getEffectiveFrom().isAfter(today)) {
                        return false;
                    }
                    if (r.getEffectiveUntil() != null && r.getEffectiveUntil().isBefore(today)) {
                        return false;
                    }
                    // Check transaction type match
                    String scope = r.getApplicableTransactionTypes();
                    if (scope == null || scope.equalsIgnoreCase("ALL")) {
                        return true;
                    }
                    if (transactionType == TransactionType.ALL) {
                        return true;
                    }
                    return scope.toUpperCase().contains(transactionType.name());
                })
                .toList();
    }

    @Transactional
    public RestrictionDTO createRestriction(CreateRestrictionRequest request, UUID actorUserId, UUID institutionId) {
        log.info("Creating restriction for parcel: {}", request.parcelId());

        Restriction restriction = Restriction.builder()
                .parcelId(request.parcelId())
                .caseId(request.caseId())
                .courtOrderId(request.courtOrderId())
                .restrictionType(request.restrictionType())
                .scopeType(request.scopeType() != null ? request.scopeType() : "FULL_PARCEL")
                .scopeArea(request.scopeArea())
                .scopeShare(request.scopeShare())
                .applicableTransactionTypes(request.applicableTransactionTypes() != null ? request.applicableTransactionTypes() : "ALL")
                .status(RestrictionStatus.DRAFT)
                .effectiveFrom(request.effectiveFrom())
                .effectiveUntil(request.effectiveUntil())
                .sourceReference(request.sourceReference())
                .createdBy(actorUserId)
                .version(0)
                .build();

        Restriction saved = restrictionRepository.save(restriction);

        auditService.recordEvent(
                actorUserId,
                institutionId,
                "CREATE_RESTRICTION",
                "Restriction",
                saved.getId(),
                "Restriction created in DRAFT status",
                String.format("Type: %s, Parcel: %s, Scope: %s", saved.getRestrictionType(), saved.getParcelId(), saved.getApplicableTransactionTypes())
        );

        return RestrictionDTO.fromEntity(saved);
    }

    @Transactional
    public RestrictionDTO activateRestriction(UUID id, UUID approverId, UUID institutionId) {
        Restriction restriction = restrictionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restriction not found with id: " + id));

        if (restriction.getStatus() == RestrictionStatus.ACTIVE) {
            throw new IllegalStateException("Restriction is already ACTIVE");
        }

        restriction.setStatus(RestrictionStatus.ACTIVE);
        restriction.setApprovedBy(approverId);
        Restriction saved = restrictionRepository.save(restriction);

        auditService.recordEvent(
                approverId,
                institutionId,
                "ACTIVATE_RESTRICTION",
                "Restriction",
                saved.getId(),
                "Restriction activated",
                "Status changed to ACTIVE"
        );

        return RestrictionDTO.fromEntity(saved);
    }

    @Transactional
    public RestrictionDTO releaseRestriction(UUID id, UUID approverId, UUID institutionId, String reason) {
        Restriction restriction = restrictionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restriction not found with id: " + id));

        if (restriction.getStatus() != RestrictionStatus.ACTIVE) {
            throw new IllegalStateException("Only ACTIVE restrictions can be released");
        }

        restriction.setStatus(RestrictionStatus.RELEASED);
        Restriction saved = restrictionRepository.save(restriction);

        auditService.recordEvent(
                approverId,
                institutionId,
                "RELEASE_RESTRICTION",
                "Restriction",
                saved.getId(),
                reason,
                "Status changed from ACTIVE to RELEASED"
        );

        return RestrictionDTO.fromEntity(saved);
    }
}
