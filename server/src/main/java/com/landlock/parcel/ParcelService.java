package com.landlock.parcel;

import com.landlock.audit.AuditService;
import com.landlock.mortgage.MortgageRepository;
import com.landlock.mortgage.MortgageStatus;
import com.landlock.restriction.RestrictionRepository;
import com.landlock.restriction.RestrictionStatus;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParcelService {

    private static final Logger log = LoggerFactory.getLogger(ParcelService.class);

    private final ParcelRepository parcelRepository;
    private final RestrictionRepository restrictionRepository;
    private final MortgageRepository mortgageRepository;
    private final AuditService auditService;

    @Transactional
    public ParcelDTO createParcel(CreateParcelRequest request, UUID actorUserId, UUID institutionId) {
        log.info("Creating land parcel in mouza: {}, dag: {}", request.mouzaCode(), request.dagNumber());

        LandParcel parcel = LandParcel.builder()
                .divisionCode(request.divisionCode())
                .districtCode(request.districtCode())
                .upazilaCode(request.upazilaCode())
                .mouzaCode(request.mouzaCode())
                .jlNumber(request.jlNumber())
                .khatianNumber(request.khatianNumber())
                .khatianType(request.khatianType() != null ? request.khatianType() : "RS")
                .dagNumber(request.dagNumber())
                .subParcelReference(request.subParcelReference())
                .recordedArea(request.recordedArea())
                .areaUnit(request.areaUnit() != null ? request.areaUnit() : "DECIMAL")
                .sourceInstitutionId(request.sourceInstitutionId() != null ? request.sourceInstitutionId() : institutionId)
                .verificationStatus(request.verificationStatus() != null ? request.verificationStatus() : ParcelVerificationStatus.UNVERIFIED)
                .lastVerifiedAt(request.verificationStatus() == ParcelVerificationStatus.VERIFIED ? Instant.now() : null)
                .version(0)
                .build();

        LandParcel saved = parcelRepository.save(parcel);

        auditService.recordEvent(
                actorUserId,
                institutionId,
                "CREATE_PARCEL",
                "LandParcel",
                saved.getId(),
                "Parcel registered in system",
                String.format("Created parcel Mouza: %s, Dag: %s, Khatian: %s", saved.getMouzaCode(), saved.getDagNumber(), saved.getKhatianNumber())
        );

        return ParcelDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ParcelDTO> searchParcels(String mouza, String dag, String khatian) {
        String cleanMouza = (mouza != null && !mouza.isBlank()) ? mouza.trim() : null;
        String cleanDag = (dag != null && !dag.isBlank()) ? dag.trim() : null;
        String cleanKhatian = (khatian != null && !khatian.isBlank()) ? khatian.trim() : null;

        if (cleanMouza == null && cleanDag == null && cleanKhatian == null) {
            return parcelRepository.findAll().stream()
                    .map(ParcelDTO::fromEntity)
                    .toList();
        }

        return parcelRepository.searchParcels(cleanMouza, cleanDag, cleanKhatian).stream()
                .map(ParcelDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ParcelDTO getParcelById(UUID id) {
        LandParcel parcel = parcelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Land parcel not found with ID: " + id));
        return ParcelDTO.fromEntity(parcel);
    }

    @Transactional(readOnly = true)
    public PublicParcelStatus getPublicStatus(UUID id) {
        if (!parcelRepository.existsById(id)) {
            throw new EntityNotFoundException("Land parcel not found with ID: " + id);
        }

        boolean hasActiveRestriction = restrictionRepository.existsByParcelIdAndStatus(id, RestrictionStatus.ACTIVE);
        boolean hasActiveMortgage = mortgageRepository.existsByParcelIdAndStatus(id, MortgageStatus.ACTIVE);

        return PublicParcelStatus.of(id, hasActiveRestriction, hasActiveMortgage);
    }
}
