package com.landlock.audit;

import com.landlock.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
@Tag(name = "Audit", description = "Tamper-evident audit trail exploration")
@SecurityRequirement(name = "bearerAuth")
public class AuditController {

    private final AuditService auditService;

    @GetMapping("/events")
    @PreAuthorize("hasAnyAuthority('ROLE_AUDITOR', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Get paginated audit events (AUDITOR or SYSTEM_ADMIN only)")
    public ResponseEntity<ApiResponse<Page<AuditEventDTO>>> getAuditEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok(auditService.getEvents(pageable)));
    }

    @GetMapping("/events/entity/{entityType}/{entityId}")
    @PreAuthorize("hasAnyAuthority('ROLE_AUDITOR', 'ROLE_SYSTEM_ADMIN')")
    @Operation(summary = "Get audit trail for a specific entity")
    public ResponseEntity<ApiResponse<?>> getEntityAuditEvents(
            @PathVariable String entityType,
            @PathVariable UUID entityId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getEventsByEntity(entityType, entityId)));
    }
}
