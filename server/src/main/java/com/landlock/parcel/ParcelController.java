package com.landlock.parcel;

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
@RequestMapping("/api/v1/parcels")
@RequiredArgsConstructor
@Tag(name = "Parcels", description = "Land parcel registration and verification endpoints")
public class ParcelController {

    private final ParcelService parcelService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_LAND_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Register new land parcel (LAND_OFFICER or SYSTEM_ADMIN)")
    public ResponseEntity<ApiResponse<ParcelDTO>> createParcel(
            @Valid @RequestBody CreateParcelRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        ParcelDTO created = parcelService.createParcel(request, actorId, instId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Land parcel registered successfully", created));
    }

    @GetMapping("/search")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Search land parcels by mouza, dag, or khatian numbers")
    public ResponseEntity<ApiResponse<List<ParcelDTO>>> searchParcels(
            @RequestParam(required = false) String mouza,
            @RequestParam(required = false) String dag,
            @RequestParam(required = false) String khatian
    ) {
        List<ParcelDTO> results = parcelService.searchParcels(mouza, dag, khatian);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get land parcel details by ID")
    public ResponseEntity<ApiResponse<ParcelDTO>> getParcelById(@PathVariable UUID id) {
        ParcelDTO parcel = parcelService.getParcelById(id);
        return ResponseEntity.ok(ApiResponse.ok(parcel));
    }

    @GetMapping("/{id}/public-status")
    @Operation(summary = "Get public risk verification status for a parcel (No authentication required)")
    public ResponseEntity<ApiResponse<PublicParcelStatus>> getPublicStatus(@PathVariable UUID id) {
        PublicParcelStatus status = parcelService.getPublicStatus(id);
        return ResponseEntity.ok(ApiResponse.ok(status));
    }
}
