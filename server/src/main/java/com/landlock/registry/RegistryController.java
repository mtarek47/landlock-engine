package com.landlock.registry;

import com.landlock.common.ApiResponse;
import com.landlock.security.UserDetailsServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/registry")
@RequiredArgsConstructor
@Tag(name = "Registry Gatekeeper", description = "Endpoints for land-registry pre-registration transaction checks")
@SecurityRequirement(name = "bearerAuth")
public class RegistryController {

    private final RegistryDecisionService registryDecisionService;

    @PostMapping("/checks")
    @PreAuthorize("hasAnyAuthority('ROLE_REGISTRY_OFFICER', 'ROLE_BANK_OFFICER', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Perform transaction check on a land parcel (Sub-Registry or Bank)")
    public ResponseEntity<ApiResponse<RegistryCheckResponse>> checkTransaction(
            @Valid @RequestBody RegistryCheckRequest request,
            @AuthenticationPrincipal UserDetailsServiceImpl.LandLockUserDetails userDetails
    ) {
        UUID actorId = userDetails != null ? userDetails.getId() : null;
        UUID instId = userDetails != null ? userDetails.getInstitutionId() : null;
        RegistryCheckResponse response = registryDecisionService.checkTransaction(request, actorId, instId);
        return ResponseEntity.ok(ApiResponse.ok("Transaction decision calculated", response));
    }

    @GetMapping("/checks/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_REGISTRY_OFFICER', 'ROLE_BANK_OFFICER', 'ROLE_SYSTEM_ADMIN', 'ROLE_AUDITOR')")
    @Operation(summary = "Get historical registry check details by ID")
    public ResponseEntity<ApiResponse<RegistryCheckResponse>> getCheckById(@PathVariable UUID id) {
        RegistryCheckResponse response = registryDecisionService.getCheckById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
