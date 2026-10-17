package com.landlock.order;

import com.landlock.common.ApiResponse;
import com.landlock.security.UserDetailsServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Court Orders", description = "Endpoints for managing court orders and approval workflows")
@SecurityRequirement(name = "bearerAuth")
public class CourtOrderController {

    private final CourtOrderService courtOrderService;

    @GetMapping("/{id}")
    @Operation(summary = "Get court order details by ID")
    public ResponseEntity<ApiResponse<CourtOrderDTO>> getOrderById(@PathVariable UUID id) {
        CourtOrderDTO order = courtOrderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasAnyAuthority('ROLE_COURT_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Submit a DRAFT court order for approval (COURT_OFFICER)")
    public ResponseEntity<ApiResponse<CourtOrderDTO>> submitOrder(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        CourtOrderDTO submitted = courtOrderService.submitOrder(id, actorId, instId);
        return ResponseEntity.ok(ApiResponse.ok("Court order submitted for approval", submitted));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyAuthority('ROLE_ORDER_APPROVER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Approve a SUBMITTED court order (ORDER_APPROVER - creator cannot approve)")
    public ResponseEntity<ApiResponse<CourtOrderDTO>> approveOrder(
            @PathVariable UUID id,
            @RequestBody(required = false) OrderActionRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID approverId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        String reason = (request != null && request.reason() != null) ? request.reason() : "Order verified and approved";
        CourtOrderDTO approved = courtOrderService.approveOrder(id, approverId, instId, reason);
        return ResponseEntity.ok(ApiResponse.ok("Court order approved successfully", approved));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyAuthority('ROLE_ORDER_APPROVER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Reject a court order (ORDER_APPROVER)")
    public ResponseEntity<ApiResponse<CourtOrderDTO>> rejectOrder(
            @PathVariable UUID id,
            @RequestBody(required = false) OrderActionRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID approverId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        String reason = (request != null && request.reason() != null) ? request.reason() : "Order rejected";
        CourtOrderDTO rejected = courtOrderService.rejectOrder(id, approverId, instId, reason);
        return ResponseEntity.ok(ApiResponse.ok("Court order rejected", rejected));
    }

    @PostMapping("/{id}/amend")
    @PreAuthorize("hasAnyAuthority('ROLE_ORDER_APPROVER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Amend an approved court order (ORDER_APPROVER)")
    public ResponseEntity<ApiResponse<CourtOrderDTO>> amendOrder(
            @PathVariable UUID id,
            @RequestBody(required = false) OrderActionRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID approverId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        String reason = (request != null && request.reason() != null) ? request.reason() : "Order amended";
        CourtOrderDTO amended = courtOrderService.amendOrder(id, approverId, instId, reason);
        return ResponseEntity.ok(ApiResponse.ok("Court order marked as amended", amended));
    }

    @PostMapping("/{id}/release")
    @PreAuthorize("hasAnyAuthority('ROLE_ORDER_APPROVER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Release/vacate an active court order (ORDER_APPROVER)")
    public ResponseEntity<ApiResponse<CourtOrderDTO>> releaseOrder(
            @PathVariable UUID id,
            @RequestBody(required = false) OrderActionRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID approverId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        String reason = (request != null && request.reason() != null) ? request.reason() : "Order vacated or released";
        CourtOrderDTO released = courtOrderService.releaseOrder(id, approverId, instId, reason);
        return ResponseEntity.ok(ApiResponse.ok("Court order released successfully", released));
    }
}
