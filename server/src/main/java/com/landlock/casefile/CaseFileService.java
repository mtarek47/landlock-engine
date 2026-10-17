package com.landlock.casefile;

import com.landlock.audit.AuditService;
import com.landlock.order.CourtOrderDTO;
import com.landlock.order.CourtOrderService;
import com.landlock.order.CreateOrderRequest;
import com.landlock.parcel.ParcelRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CaseFileService {

    private static final Logger log = LoggerFactory.getLogger(CaseFileService.class);

    private final CaseFileRepository caseFileRepository;
    private final CaseParcelRepository caseParcelRepository;
    private final ParcelRepository parcelRepository;
    private final CourtOrderService courtOrderService;
    private final AuditService auditService;

    @Transactional
    public CaseFileDTO createCase(CreateCaseRequest request, UUID actorUserId, UUID institutionId) {
        log.info("Registering legal case: {}", request.caseNumber());

        CaseFile caseFile = CaseFile.builder()
                .caseNumber(request.caseNumber())
                .courtInstitutionId(request.courtInstitutionId() != null ? request.courtInstitutionId() : institutionId)
                .caseType(request.caseType())
                .filingDate(request.filingDate())
                .caseStatus(CaseStatus.ACTIVE)
                .restrictedSummary(request.restrictedSummary())
                .sourceReference(request.sourceReference())
                .createdBy(actorUserId)
                .build();

        CaseFile saved = caseFileRepository.save(caseFile);

        if (request.initialParcelIds() != null) {
            for (UUID parcelId : request.initialParcelIds()) {
                if (parcelRepository.existsById(parcelId)) {
                    CaseParcel cp = CaseParcel.builder()
                            .caseId(saved.getId())
                            .parcelId(parcelId)
                            .scopeType("FULL_PARCEL")
                            .build();
                    caseParcelRepository.save(cp);
                }
            }
        }

        auditService.recordEvent(
                actorUserId,
                institutionId,
                "CREATE_CASE",
                "CaseFile",
                saved.getId(),
                "Case record initiated",
                String.format("Case: %s, Court Institution: %s", saved.getCaseNumber(), saved.getCourtInstitutionId())
        );

        List<UUID> parcelIds = caseParcelRepository.findByCaseId(saved.getId()).stream()
                .map(CaseParcel::getParcelId)
                .toList();

        return CaseFileDTO.fromEntity(saved, parcelIds);
    }

    @Transactional(readOnly = true)
    public CaseFileDTO getCaseById(UUID id) {
        CaseFile caseFile = caseFileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Case file not found with ID: " + id));

        List<UUID> parcelIds = caseParcelRepository.findByCaseId(caseFile.getId()).stream()
                .map(CaseParcel::getParcelId)
                .toList();

        return CaseFileDTO.fromEntity(caseFile, parcelIds);
    }

    @Transactional
    public CaseFileDTO addParcelToCase(UUID caseId, AddCaseParcelRequest request, UUID actorUserId, UUID institutionId) {
        CaseFile caseFile = caseFileRepository.findById(caseId)
                .orElseThrow(() -> new EntityNotFoundException("Case file not found with ID: " + caseId));

        if (!parcelRepository.existsById(request.parcelId())) {
            throw new EntityNotFoundException("Land parcel not found with ID: " + request.parcelId());
        }

        if (caseParcelRepository.findByCaseIdAndParcelId(caseId, request.parcelId()).isPresent()) {
            throw new IllegalStateException("Parcel is already attached to this case");
        }

        CaseParcel caseParcel = CaseParcel.builder()
                .caseId(caseId)
                .parcelId(request.parcelId())
                .scopeType(request.scopeType() != null ? request.scopeType() : "FULL_PARCEL")
                .scopeArea(request.scopeArea())
                .scopeShare(request.scopeShare())
                .build();

        caseParcelRepository.save(caseParcel);

        auditService.recordEvent(
                actorUserId,
                institutionId,
                "ADD_PARCEL_TO_CASE",
                "CaseFile",
                caseId,
                "Parcel attached to litigation record",
                String.format("Attached Parcel ID: %s to Case ID: %s", request.parcelId(), caseId)
        );

        List<UUID> parcelIds = caseParcelRepository.findByCaseId(caseId).stream()
                .map(CaseParcel::getParcelId)
                .toList();

        return CaseFileDTO.fromEntity(caseFile, parcelIds);
    }

    @Transactional
    public CourtOrderDTO addOrderToCase(UUID caseId, CreateOrderRequest request, UUID actorUserId, UUID institutionId) {
        if (!caseFileRepository.existsById(caseId)) {
            throw new EntityNotFoundException("Case file not found with ID: " + caseId);
        }

        CreateOrderRequest orderReq = new CreateOrderRequest(
                caseId,
                request.orderReference(),
                request.orderType(),
                request.orderDate(),
                request.effectiveFrom(),
                request.effectiveUntil(),
                request.transactionScope(),
                request.sourceDocumentReference(),
                request.supersedesOrderId()
        );

        return courtOrderService.createOrder(orderReq, actorUserId, institutionId);
    }
}
