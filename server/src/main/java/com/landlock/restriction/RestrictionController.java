package com.landlock.restriction;

import com.landlock.common.ApiResponse;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/restrictions")
@RequiredArgsConstructor
@Tag(name = "Restrictions", description = "Endpoints for managing legal restrictions on parcels")
@SecurityRequirement(name = "bearerAuth")
public class RestrictionController {

    private final RestrictionService restrictionService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_COURT_OFFICER', 'ROLE_ORDER_APPROVER', 'ROLE_LAND_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Create restriction on a land parcel")
    public ResponseEntity<ApiResponse<RestrictionDTO>> createRestriction(
            @Valid @RequestBody CreateRestrictionRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        RestrictionDTO created = restrictionService.createRestriction(request, actorId, instId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Restriction created successfully", created));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restriction details by ID")
    public ResponseEntity<ApiResponse<RestrictionDTO>> getRestrictionById(@PathVariable UUID id) {
        RestrictionDTO dto = restrictionService.getRestrictionById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/parcel/{parcelId}")
    @Operation(summary = "Get all restrictions for a specific land parcel")
    public ResponseEntity<ApiResponse<List<RestrictionDTO>>> getRestrictionsByParcel(@PathVariable UUID parcelId) {
        List<RestrictionDTO> list = restrictionService.getRestrictionsByParcel(parcelId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/{id}/release")
    @PreAuthorize("hasAnyAuthority('ROLE_ORDER_APPROVER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Release an active restriction (ORDER_APPROVER or SYSTEM_ADMIN)")
    public ResponseEntity<ApiResponse<RestrictionDTO>> releaseRestriction(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "Order dissolved or lifted by court") String reason,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        RestrictionDTO released = restrictionService.releaseRestriction(id, actorId, instId, reason);
        return ResponseEntity.ok(ApiResponse.ok("Restriction released successfully", released));
    }
}
