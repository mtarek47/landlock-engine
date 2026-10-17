package com.landlock.mortgage;

import com.landlock.common.ApiResponse;
import com.landlock.security.Role;
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
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/mortgages")
@RequiredArgsConstructor
@Tag(name = "Mortgages", description = "Endpoints for managing bank mortgages and liens")
@SecurityRequirement(name = "bearerAuth")
public class MortgageController {

    private final MortgageService mortgageService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_BANK_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Register a new mortgage against a parcel (BANK_OFFICER)")
    public ResponseEntity<ApiResponse<MortgageDTO>> createMortgage(
            @Valid @RequestBody CreateMortgageRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        MortgageDTO created = mortgageService.createMortgage(request, actorId, instId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Mortgage registered successfully", created));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_BANK_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Get mortgage details by ID (Restricted to lending institution or SYSTEM_ADMIN)")
    public ResponseEntity<ApiResponse<MortgageDTO>> getMortgageById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        boolean isAdmin = userDetails != null && userDetails.getRole() == Role.SYSTEM_ADMIN;
        MortgageDTO dto = mortgageService.getMortgageById(id, instId, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PostMapping("/{id}/release")
    @PreAuthorize("hasAnyAuthority('ROLE_BANK_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Release an active mortgage lien (BANK_OFFICER)")
    public ResponseEntity<ApiResponse<MortgageDTO>> releaseMortgage(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        String releaseRef = body != null ? body.get("releaseReference") : null;
        if (releaseRef == null || releaseRef.isBlank()) {
            releaseRef = "Bank discharge / NOC issued";
        }
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        boolean isAdmin = userDetails != null && userDetails.getRole() == Role.SYSTEM_ADMIN;

        MortgageDTO released = mortgageService.releaseMortgage(id, releaseRef, actorId, instId, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Mortgage released successfully", released));
    }

    @PostMapping("/verify")
    @PreAuthorize("hasAnyAuthority('ROLE_REGISTRY_OFFICER', 'ROLE_BANK_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Verify mortgage status on a parcel (REGISTRY_OFFICER or BANK_OFFICER)")
    public ResponseEntity<ApiResponse<List<MortgageDTO>>> verifyMortgages(@RequestBody Map<String, UUID> request) {
        UUID parcelId = request.get("parcelId");
        if (parcelId == null) {
            throw new IllegalArgumentException("parcelId is required");
        }
        List<MortgageDTO> activeMortgages = mortgageService.getActiveMortgagesByParcel(parcelId);
        return ResponseEntity.ok(ApiResponse.ok("Mortgage verification result", activeMortgages));
    }
}
