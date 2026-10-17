package com.landlock.mortgage;

import com.landlock.audit.AuditService;
import com.landlock.parcel.ParcelRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MortgageService {

    private static final Logger log = LoggerFactory.getLogger(MortgageService.class);

    private final MortgageRepository mortgageRepository;
    private final ParcelRepository parcelRepository;
    private final AuditService auditService;

    @Transactional
    public MortgageDTO createMortgage(CreateMortgageRequest request, UUID actorUserId, UUID institutionId) {
        log.info("Registering mortgage with lender ref: {} for parcel: {}", request.lenderReference(), request.parcelId());

        if (!parcelRepository.existsById(request.parcelId())) {
            throw new EntityNotFoundException("Land parcel not found with ID: " + request.parcelId());
        }

        UUID lenderInstId = request.lenderInstitutionId() != null ? request.lenderInstitutionId() : institutionId;
        if (lenderInstId == null) {
            throw new IllegalArgumentException("Lender institution ID is required");
        }

        Mortgage mortgage = Mortgage.builder()
                .parcelId(request.parcelId())
                .lenderInstitutionId(lenderInstId)
                .lenderReference(request.lenderReference())
                .scopeType(request.scopeType() != null ? request.scopeType() : "FULL_PARCEL")
                .securedArea(request.securedArea())
                .securedShare(request.securedShare())
                .effectiveFrom(request.effectiveFrom())
                .effectiveUntil(request.effectiveUntil())
                .status(MortgageStatus.ACTIVE)
                .createdBy(actorUserId)
                .version(0)
                .build();

        Mortgage saved = mortgageRepository.save(mortgage);

        auditService.recordEvent(
                actorUserId,
                lenderInstId,
                "REGISTER_MORTGAGE",
                "Mortgage",
                saved.getId(),
                "Bank mortgage / lien registered",
                String.format("Lender Ref: %s, Parcel: %s, Secured Area: %s", saved.getLenderReference(), saved.getParcelId(), saved.getSecuredArea())
        );

        return MortgageDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public MortgageDTO getMortgageById(UUID id, UUID requestingInstitutionId, boolean isSystemAdmin) {
        Mortgage mortgage = mortgageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Mortgage record not found with ID: " + id));

        if (!isSystemAdmin && !mortgage.getLenderInstitutionId().equals(requestingInstitutionId)) {
            throw new AccessDeniedException("Access denied: You are not authorized to view mortgage records from another institution.");
        }

        return MortgageDTO.fromEntity(mortgage);
    }

    @Transactional
    public MortgageDTO releaseMortgage(UUID id, String releaseReference, UUID actorUserId, UUID institutionId, boolean isSystemAdmin) {
        Mortgage mortgage = mortgageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Mortgage record not found with ID: " + id));

        if (!isSystemAdmin && !mortgage.getLenderInstitutionId().equals(institutionId)) {
            throw new AccessDeniedException("Access denied: Only the lending institution or System Admin can release this mortgage.");
        }

        if (mortgage.getStatus() == MortgageStatus.RELEASED) {
            throw new IllegalStateException("Mortgage is already released.");
        }

        mortgage.setStatus(MortgageStatus.RELEASED);
        mortgage.setReleaseReference(releaseReference);
        Mortgage saved = mortgageRepository.save(mortgage);

        auditService.recordEvent(
                actorUserId,
                institutionId,
                "RELEASE_MORTGAGE",
                "Mortgage",
                saved.getId(),
                "Mortgage lien discharge recorded",
                String.format("Release Reference: %s, Parcel: %s", releaseReference, saved.getParcelId())
        );

        return MortgageDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<MortgageDTO> getMortgagesByParcel(UUID parcelId) {
        return mortgageRepository.findByParcelId(parcelId).stream()
                .map(MortgageDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MortgageDTO> getActiveMortgagesByParcel(UUID parcelId) {
        return mortgageRepository.findByParcelIdAndStatus(parcelId, MortgageStatus.ACTIVE).stream()
                .map(MortgageDTO::fromEntity)
                .toList();
    }
}
