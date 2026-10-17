package com.landlock.registry;

import com.landlock.audit.AuditService;
import com.landlock.institution.InstitutionRepository;
import com.landlock.mortgage.Mortgage;
import com.landlock.mortgage.MortgageRepository;
import com.landlock.mortgage.MortgageStatus;
import com.landlock.order.TransactionType;
import com.landlock.parcel.LandParcel;
import com.landlock.parcel.ParcelRepository;
import com.landlock.restriction.Restriction;
import com.landlock.restriction.RestrictionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RegistryDecisionService {

    private static final Logger log = LoggerFactory.getLogger(RegistryDecisionService.class);

    private final ParcelRepository parcelRepository;
    private final RestrictionService restrictionService;
    private final MortgageRepository mortgageRepository;
    private final RegistryCheckRepository registryCheckRepository;
    private final InstitutionRepository institutionRepository;
    private final AuditService auditService;

    @Transactional
    public RegistryCheckResponse checkTransaction(RegistryCheckRequest request, UUID actorUserId, UUID institutionId) {
        String correlationId = UUID.randomUUID().toString();
        log.info("[{}] Processing registry check request: {}, institution: {}", correlationId, request.requestId(), institutionId);

        try {
            // Check for idempotent replay
            if (institutionId != null) {
                Optional<RegistryCheck> existingCheck = registryCheckRepository
                        .findByRequestIdAndRequestingInstitutionId(request.requestId(), institutionId);
                if (existingCheck.isPresent()) {
                    log.info("[{}] Idempotent request detected for requestId: {}", correlationId, request.requestId());
                    return toResponse(existingCheck.get(), Collections.emptyList(), Collections.emptyList());
                }
            }

            // 1. Validate institution permission
            if (institutionId != null && !institutionRepository.existsById(institutionId)) {
                log.warn("[{}] Requesting institution not recognized: {}", correlationId, institutionId);
            }

            // 2. Find parcel - if not found or ambiguous return REVIEW_REQUIRED
            LandParcel parcel = resolveParcel(request);
            if (parcel == null) {
                return buildAndPersistDecision(
                        request,
                        null,
                        RegistryDecision.REVIEW_REQUIRED,
                        List.of("PARCEL_NOT_FOUND_OR_AMBIGUOUS"),
                        Collections.emptyList(),
                        Collections.emptyList(),
                        "Land parcel could not be uniquely identified in registry records. Manual verification required.",
                        actorUserId,
                        institutionId,
                        correlationId
                );
            }

            // 3. Check for ACTIVE restrictions matching transaction type
            TransactionType txType = request.transactionType() != null ? request.transactionType() : TransactionType.ALL;
            List<Restriction> activeRestrictions = restrictionService.findActiveRestrictionsForTransaction(parcel.getId(), txType);

            if (!activeRestrictions.isEmpty()) {
                List<String> restrictionRefs = activeRestrictions.stream()
                        .map(r -> r.getSourceReference() != null ? r.getSourceReference() : r.getId().toString())
                        .toList();
                return buildAndPersistDecision(
                        request,
                        parcel.getId(),
                        RegistryDecision.BLOCKED_BY_VALID_ORDER,
                        List.of("ACTIVE_COURT_INJUNCTION_OR_BLOCK", "TRANSFER_PROHIBITED"),
                        restrictionRefs,
                        Collections.emptyList(),
                        String.format("Transaction blocked by %d active legal restriction(s).", activeRestrictions.size()),
                        actorUserId,
                        institutionId,
                        correlationId
                );
            }

            // 4. Check for ACTIVE mortgages with no release
            List<Mortgage> activeMortgages = mortgageRepository.findByParcelIdAndStatus(parcel.getId(), MortgageStatus.ACTIVE);
            if (!activeMortgages.isEmpty()) {
                List<String> mortgageRefs = activeMortgages.stream()
                        .map(Mortgage::getLenderReference)
                        .toList();
                return buildAndPersistDecision(
                        request,
                        parcel.getId(),
                        RegistryDecision.MORTGAGE_REQUIRES_RELEASE,
                        List.of("ACTIVE_MORTGAGE_LIEN", "BANK_NOC_REQUIRED"),
                        Collections.emptyList(),
                        mortgageRefs,
                        String.format("Parcel is subject to %d active mortgage lien(s). Formal bank release / NOC required.", activeMortgages.size()),
                        actorUserId,
                        institutionId,
                        correlationId
                );
            }

            // 5. Return CLEAR otherwise (with disclaimer)
            return buildAndPersistDecision(
                    request,
                    parcel.getId(),
                    RegistryDecision.CLEAR,
                    List.of("NO_BLOCKING_RESTRICTIONS_FOUND"),
                    Collections.emptyList(),
                    Collections.emptyList(),
                    "No active injunctions, adverse orders, or unreleased mortgage encumbrances detected.",
                    actorUserId,
                    institutionId,
                    correlationId
            );

        } catch (Exception ex) {
            log.error("[{}] Error executing registry check: {}", correlationId, ex.getMessage(), ex);
            return handleSystemUnavailable(request, actorUserId, institutionId, correlationId, ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public RegistryCheckResponse getCheckById(UUID id) {
        RegistryCheck check = registryCheckRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Registry check record not found with ID: " + id));
        return toResponse(check, Collections.emptyList(), Collections.emptyList());
    }

    private LandParcel resolveParcel(RegistryCheckRequest request) {
        if (request.parcelId() != null) {
            return parcelRepository.findById(request.parcelId()).orElse(null);
        }
        if (request.mouzaCode() != null && request.dagNumber() != null) {
            List<LandParcel> matches = parcelRepository.findByMouzaCodeAndDagNumber(
                    request.mouzaCode().trim(), request.dagNumber().trim()
            );
            if (matches.size() == 1) {
                return matches.get(0);
            }
        }
        return null;
    }

    private RegistryCheckResponse buildAndPersistDecision(
            RegistryCheckRequest request,
            UUID parcelId,
            RegistryDecision decision,
            List<String> reasonCodes,
            List<String> restrictionRefs,
            List<String> mortgageRefs,
            String summary,
            UUID actorUserId,
            UUID institutionId,
            String correlationId
    ) {
        Instant now = Instant.now();
        String reasonStr = String.join(",", reasonCodes);

        RegistryCheck check = RegistryCheck.builder()
                .requestId(request.requestId())
                .requestingInstitutionId(institutionId != null ? institutionId : UUID.fromString("00000000-0000-0000-0000-000000000000"))
                .parcelId(parcelId)
                .transactionType(request.transactionType() != null ? request.transactionType().name() : "ALL")
                .decision(decision)
                .reasonCodes(reasonStr)
                .dataFreshness(now)
                .correlationId(correlationId)
                .checkedAt(now)
                .responseSummary(summary)
                .build();

        RegistryCheck saved = registryCheckRepository.save(check);

        auditService.recordEvent(
                actorUserId,
                institutionId,
                "REGISTRY_CHECK",
                "LandParcel",
                parcelId,
                "Registry decision calculated: " + decision.name(),
                String.format("RequestId: %s, Decision: %s, Summary: %s", request.requestId(), decision, summary),
                correlationId
        );

        return new RegistryCheckResponse(
                saved.getId(),
                saved.getRequestId(),
                saved.getParcelId(),
                request.transactionType(),
                saved.getDecision(),
                reasonCodes,
                restrictionRefs.size(),
                mortgageRefs.size(),
                restrictionRefs,
                mortgageRefs,
                saved.getCheckedAt(),
                saved.getDataFreshness(),
                correlationId,
                RegistryCheckResponse.LEGAL_DISCLAIMER,
                summary
        );
    }

    private RegistryCheckResponse handleSystemUnavailable(
            RegistryCheckRequest request,
            UUID actorUserId,
            UUID institutionId,
            String correlationId,
            String errorMsg
    ) {
        Instant now = Instant.now();
        RegistryCheck check = RegistryCheck.builder()
                .requestId(request.requestId())
                .requestingInstitutionId(institutionId != null ? institutionId : UUID.fromString("00000000-0000-0000-0000-000000000000"))
                .parcelId(request.parcelId())
                .transactionType(request.transactionType() != null ? request.transactionType().name() : "ALL")
                .decision(RegistryDecision.SYSTEM_UNAVAILABLE)
                .reasonCodes("SYSTEM_ERROR")
                .dataFreshness(now)
                .correlationId(correlationId)
                .checkedAt(now)
                .responseSummary("Registry verification failed due to internal error: " + errorMsg)
                .build();

        try {
            check = registryCheckRepository.save(check);
        } catch (Exception e) {
            log.warn("Could not persist SYSTEM_UNAVAILABLE registry check", e);
        }

        auditService.recordEvent(
                actorUserId,
                institutionId,
                "REGISTRY_CHECK_ERROR",
                "LandParcel",
                request.parcelId(),
                "Registry verification failed: " + errorMsg,
                "Decision: SYSTEM_UNAVAILABLE",
                correlationId
        );

        return new RegistryCheckResponse(
                check.getId(),
                request.requestId(),
                request.parcelId(),
                request.transactionType(),
                RegistryDecision.SYSTEM_UNAVAILABLE,
                List.of("SYSTEM_ERROR"),
                0,
                0,
                Collections.emptyList(),
                Collections.emptyList(),
                now,
                now,
                correlationId,
                RegistryCheckResponse.LEGAL_DISCLAIMER,
                "Verification engine currently unavailable. Please re-query."
        );
    }

    private RegistryCheckResponse toResponse(RegistryCheck check, List<String> restrictionRefs, List<String> mortgageRefs) {
        List<String> reasonList = (check.getReasonCodes() != null && !check.getReasonCodes().isBlank())
                ? Arrays.asList(check.getReasonCodes().split(","))
                : Collections.emptyList();

        TransactionType txType;
        try {
            txType = TransactionType.valueOf(check.getTransactionType());
        } catch (Exception e) {
            txType = TransactionType.ALL;
        }

        return new RegistryCheckResponse(
                check.getId(),
                check.getRequestId(),
                check.getParcelId(),
                txType,
                check.getDecision(),
                reasonList,
                restrictionRefs.size(),
                mortgageRefs.size(),
                restrictionRefs,
                mortgageRefs,
                check.getCheckedAt(),
                check.getDataFreshness(),
                check.getCorrelationId(),
                RegistryCheckResponse.LEGAL_DISCLAIMER,
                check.getResponseSummary()
        );
    }
}
