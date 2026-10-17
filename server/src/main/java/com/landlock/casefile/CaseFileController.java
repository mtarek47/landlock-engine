package com.landlock.casefile;

import com.landlock.common.ApiResponse;
import com.landlock.order.CourtOrderDTO;
import com.landlock.order.CreateOrderRequest;
import com.landlock.security.UserDetailsServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cases")
@RequiredArgsConstructor
@Tag(name = "Cases", description = "Endpoints for managing legal cases and associated parcels")
@SecurityRequirement(name = "bearerAuth")
public class CaseFileController {

    private final CaseFileService caseFileService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_COURT_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Register a new legal case (COURT_OFFICER or SYSTEM_ADMIN)")
    public ResponseEntity<ApiResponse<CaseFileDTO>> createCase(
            @Valid @RequestBody CreateCaseRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        CaseFileDTO created = caseFileService.createCase(request, actorId, instId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Case file registered successfully", created));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_COURT_OFFICER', 'ROLE_ORDER_APPROVER', 'ROLE_REGISTRY_OFFICER', 'ROLE_SYSTEM_ADMIN', 'ROLE_AUDITOR')")
    @Operation(summary = "Get legal case details by ID")
    public ResponseEntity<ApiResponse<CaseFileDTO>> getCaseById(@PathVariable UUID id) {
        CaseFileDTO caseFile = caseFileService.getCaseById(id);
        return ResponseEntity.ok(ApiResponse.ok(caseFile));
    }

    @PostMapping("/{id}/parcels")
    @PreAuthorize("hasAnyAuthority('ROLE_COURT_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Associate a land parcel with a legal case (COURT_OFFICER)")
    public ResponseEntity<ApiResponse<CaseFileDTO>> addParcelToCase(
            @PathVariable UUID id,
            @Valid @RequestBody AddCaseParcelRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        CaseFileDTO updated = caseFileService.addParcelToCase(id, request, actorId, instId);
        return ResponseEntity.ok(ApiResponse.ok("Parcel successfully linked to case", updated));
    }

    @PostMapping("/{id}/orders")
    @PreAuthorize("hasAnyAuthority('ROLE_COURT_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Create and attach a court order to a case (COURT_OFFICER)")
    public ResponseEntity<ApiResponse<CourtOrderDTO>> addOrderToCase(
            @PathVariable UUID id,
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        CourtOrderDTO created = caseFileService.addOrderToCase(id, request, actorId, instId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Court order created and linked to case", created));
    }
}
