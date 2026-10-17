package com.landlock.institution;

import com.landlock.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/institutions")
@RequiredArgsConstructor
@Tag(name = "Institutions", description = "Endpoints for managing participating institutions")
@SecurityRequirement(name = "bearerAuth")
public class InstitutionController {

    private final InstitutionService institutionService;

    @GetMapping
    @Operation(summary = "List all institutions")
    public ResponseEntity<ApiResponse<List<InstitutionDTO>>> getAllInstitutions() {
        return ResponseEntity.ok(ApiResponse.ok(institutionService.getAllInstitutions()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get institution details by ID")
    public ResponseEntity<ApiResponse<InstitutionDTO>> getInstitutionById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(institutionService.getInstitutionById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Register a new institution (SYSTEM_ADMIN only)")
    public ResponseEntity<ApiResponse<InstitutionDTO>> createInstitution(@RequestBody InstitutionDTO dto) {
        InstitutionDTO created = institutionService.createInstitution(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Institution created successfully", created));
    }
}
