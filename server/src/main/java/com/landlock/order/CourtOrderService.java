package com.landlock.order;

import com.landlock.audit.AuditService;
import com.landlock.casefile.CaseParcel;
import com.landlock.casefile.CaseParcelRepository;
import com.landlock.restriction.Restriction;
import com.landlock.restriction.RestrictionRepository;
import com.landlock.restriction.RestrictionStatus;
import com.landlock.restriction.RestrictionType;
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
public class CourtOrderService {

    private static final Logger log = LoggerFactory.getLogger(CourtOrderService.class);

    private final CourtOrderRepository courtOrderRepository;
    private final CaseParcelRepository caseParcelRepository;
    private final RestrictionRepository restrictionRepository;
    private final AuditService auditService;

    @Transactional
    public CourtOrderDTO createOrder(CreateOrderRequest request, UUID actorUserId, UUID institutionId) {
        log.info("Creating court order ref: {} for case: {}", request.orderReference(), request.caseId());

        CourtOrder order = CourtOrder.builder()
                .caseId(request.caseId())
                .orderReference(request.orderReference())
                .orderType(request.orderType())
                .orderDate(request.orderDate())
                .effectiveFrom(request.effectiveFrom())
                .effectiveUntil(request.effectiveUntil())
                .transactionScope(request.transactionScope() != null ? request.transactionScope() : TransactionType.ALL)
                .sourceDocumentReference(request.sourceDocumentReference())
                .verificationStatus("PENDING")
                .approvalStatus(OrderStatus.DRAFT)
                .supersedesOrderId(request.supersedesOrderId())
                .createdBy(actorUserId)
                .build();

        CourtOrder saved = courtOrderRepository.save(order);

        auditService.recordEvent(
                actorUserId,
                institutionId,
                "CREATE_ORDER",
                "CourtOrder",
                saved.getId(),
                "Court order created in DRAFT state",
                String.format("Order Ref: %s, Type: %s, Case: %s", saved.getOrderReference(), saved.getOrderType(), saved.getCaseId())
        );

        return CourtOrderDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public CourtOrderDTO getOrderById(UUID id) {
        CourtOrder order = courtOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Court order not found with ID: " + id));
        return CourtOrderDTO.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public List<CourtOrderDTO> getOrdersByCaseId(UUID caseId) {
        return courtOrderRepository.findByCaseId(caseId).stream()
                .map(CourtOrderDTO::fromEntity)
                .toList();
    }

    @Transactional
    public CourtOrderDTO submitOrder(UUID orderId, UUID actorUserId, UUID institutionId) {
        CourtOrder order = courtOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Court order not found with ID: " + orderId));

        if (order.getApprovalStatus() != OrderStatus.DRAFT) {
            throw new IllegalStateException("Only orders in DRAFT status can be submitted for review. Current status: " + order.getApprovalStatus());
        }

        order.setApprovalStatus(OrderStatus.SUBMITTED);
        order.setVerificationStatus("SUBMITTED_FOR_REVIEW");
        CourtOrder saved = courtOrderRepository.save(order);

        auditService.recordEvent(
                actorUserId,
                institutionId,
                "SUBMIT_ORDER",
                "CourtOrder",
                saved.getId(),
                "Order submitted for judicial/administrative approval",
                "Status transitioned: DRAFT -> SUBMITTED"
        );

        return CourtOrderDTO.fromEntity(saved);
    }

    @Transactional
    public CourtOrderDTO approveOrder(UUID orderId, UUID approverId, UUID institutionId, String reason) {
        CourtOrder order = courtOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Court order not found with ID: " + orderId));

        // Enforce segregation of duties: creator cannot approve their own order
        if (order.getCreatedBy() != null && order.getCreatedBy().equals(approverId)) {
            throw new IllegalStateException("Segregation of duties violation: Approver cannot be the same user who created the order.");
        }

        if (order.getApprovalStatus() != OrderStatus.SUBMITTED && order.getApprovalStatus() != OrderStatus.UNDER_REVIEW) {
            throw new IllegalStateException("Only SUBMITTED or UNDER_REVIEW orders can be approved. Current status: " + order.getApprovalStatus());
        }

        order.setApprovalStatus(OrderStatus.APPROVED);
        order.setVerificationStatus("VERIFIED");
        order.setApprovedBy(approverId);
        order.setApprovedAt(Instant.now());
        CourtOrder saved = courtOrderRepository.save(order);

        // Apply restrictions to all parcels linked to the case
        List<CaseParcel> caseParcels = caseParcelRepository.findByCaseId(order.getCaseId());
        for (CaseParcel cp : caseParcels) {
            Restriction restriction = Restriction.builder()
                    .parcelId(cp.getParcelId())
                    .caseId(order.getCaseId())
                    .courtOrderId(order.getId())
                    .restrictionType(RestrictionType.COURT_INJUNCTION)
                    .scopeType(cp.getScopeType() != null ? cp.getScopeType() : "FULL_PARCEL")
                    .scopeArea(cp.getScopeArea())
                    .scopeShare(cp.getScopeShare())
                    .applicableTransactionTypes(order.getTransactionScope().name())
                    .status(RestrictionStatus.ACTIVE)
                    .effectiveFrom(order.getEffectiveFrom())
                    .effectiveUntil(order.getEffectiveUntil())
                    .sourceReference(order.getOrderReference())
                    .createdBy(order.getCreatedBy())
                    .approvedBy(approverId)
                    .version(0)
                    .build();

            restrictionRepository.save(restriction);
            log.info("Active restriction created for parcel {} under order {}", cp.getParcelId(), order.getOrderReference());
        }

        auditService.recordEvent(
                approverId,
                institutionId,
                "APPROVE_ORDER",
                "CourtOrder",
                saved.getId(),
                reason != null ? reason : "Court order approved",
                "Status transitioned to APPROVED and active restrictions generated for " + caseParcels.size() + " parcels"
        );

        return CourtOrderDTO.fromEntity(saved);
    }

    @Transactional
    public CourtOrderDTO rejectOrder(UUID orderId, UUID approverId, UUID institutionId, String reason) {
        CourtOrder order = courtOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Court order not found with ID: " + orderId));

        if (order.getApprovalStatus() != OrderStatus.SUBMITTED && order.getApprovalStatus() != OrderStatus.UNDER_REVIEW) {
            throw new IllegalStateException("Only SUBMITTED or UNDER_REVIEW orders can be rejected. Current status: " + order.getApprovalStatus());
        }

        order.setApprovalStatus(OrderStatus.REJECTED);
        order.setVerificationStatus("REJECTED");
        order.setApprovedBy(approverId);
        order.setApprovedAt(Instant.now());
        CourtOrder saved = courtOrderRepository.save(order);

        auditService.recordEvent(
                approverId,
                institutionId,
                "REJECT_ORDER",
                "CourtOrder",
                saved.getId(),
                reason != null ? reason : "Order rejected by approver",
                "Status transitioned to REJECTED"
        );

        return CourtOrderDTO.fromEntity(saved);
    }

    @Transactional
    public CourtOrderDTO amendOrder(UUID orderId, UUID approverId, UUID institutionId, String reason) {
        CourtOrder order = courtOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Court order not found with ID: " + orderId));

        if (order.getApprovalStatus() != OrderStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED orders can be amended. Current status: " + order.getApprovalStatus());
        }

        order.setApprovalStatus(OrderStatus.AMENDED);
        CourtOrder saved = courtOrderRepository.save(order);

        auditService.recordEvent(
                approverId,
                institutionId,
                "AMEND_ORDER",
                "CourtOrder",
                saved.getId(),
                reason != null ? reason : "Order marked as amended",
                "Status transitioned: APPROVED -> AMENDED"
        );

        return CourtOrderDTO.fromEntity(saved);
    }

    @Transactional
    public CourtOrderDTO releaseOrder(UUID orderId, UUID approverId, UUID institutionId, String reason) {
        CourtOrder order = courtOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Court order not found with ID: " + orderId));

        if (order.getApprovalStatus() != OrderStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED orders can be released. Current status: " + order.getApprovalStatus());
        }

        order.setApprovalStatus(OrderStatus.RELEASED);
        CourtOrder saved = courtOrderRepository.save(order);

        // Also release associated active restrictions
        List<Restriction> restrictions = restrictionRepository.findByCourtOrderId(orderId);
        for (Restriction restriction : restrictions) {
            if (restriction.getStatus() == RestrictionStatus.ACTIVE) {
                restriction.setStatus(RestrictionStatus.RELEASED);
                restrictionRepository.save(restriction);
            }
        }

        auditService.recordEvent(
                approverId,
                institutionId,
                "RELEASE_ORDER",
                "CourtOrder",
                saved.getId(),
                reason != null ? reason : "Order vacated or released",
                "Status transitioned to RELEASED and associated restrictions vacated"
        );

        return CourtOrderDTO.fromEntity(saved);
    }
}
