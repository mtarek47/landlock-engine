package com.landlock.registry;

import com.landlock.audit.AuditService;
import com.landlock.institution.InstitutionRepository;
import com.landlock.mortgage.Mortgage;
import com.landlock.mortgage.MortgageRepository;
import com.landlock.mortgage.MortgageStatus;
import com.landlock.order.TransactionType;
import com.landlock.parcel.LandParcel;
import com.landlock.parcel.ParcelRepository;
import com.landlock.restriction.Restriction;
import com.landlock.restriction.RestrictionService;
import com.landlock.restriction.RestrictionStatus;
import com.landlock.restriction.RestrictionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistryDecisionServiceTest {

    @Mock
    private ParcelRepository parcelRepository;

    @Mock
    private RestrictionService restrictionService;

    @Mock
    private MortgageRepository mortgageRepository;

    @Mock
    private RegistryCheckRepository registryCheckRepository;

    @Mock
    private InstitutionRepository institutionRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private RegistryDecisionService registryDecisionService;

    private UUID parcelId;
    private UUID institutionId;
    private UUID actorUserId;
    private LandParcel mockParcel;

    @BeforeEach
    void setUp() {
        parcelId = UUID.randomUUID();
        institutionId = UUID.randomUUID();
        actorUserId = UUID.randomUUID();

        mockParcel = LandParcel.builder()
                .id(parcelId)
                .divisionCode("DHAKA")
                .districtCode("DHAKA")
                .upazilaCode("DHANMONDI")
                .mouzaCode("DHANMONDI-01")
                .dagNumber("5001")
                .khatianNumber("101")
                .build();

        lenient().when(registryCheckRepository.findByRequestIdAndRequestingInstitutionId(anyString(), any(UUID.class)))
                .thenReturn(Optional.empty());

        lenient().when(registryCheckRepository.save(any(RegistryCheck.class)))
                .thenAnswer(invocation -> {
                    RegistryCheck check = invocation.getArgument(0);
                    if (check.getId() == null) {
                        check.setId(UUID.randomUUID());
                    }
                    return check;
                });
    }

    @Test
    void testBlockedByValidOrder() {
        RegistryCheckRequest request = new RegistryCheckRequest(
                "REQ-001",
                parcelId,
                null, null, null, null, null, null,
                TransactionType.SALE
        );

        when(parcelRepository.findById(parcelId)).thenReturn(Optional.of(mockParcel));

        Restriction restriction = Restriction.builder()
                .id(UUID.randomUUID())
                .parcelId(parcelId)
                .restrictionType(RestrictionType.COURT_INJUNCTION)
                .applicableTransactionTypes("SALE")
                .status(RestrictionStatus.ACTIVE)
                .effectiveFrom(LocalDate.now().minusDays(10))
                .sourceReference("ORD-DH-2024-991")
                .build();

        when(restrictionService.findActiveRestrictionsForTransaction(parcelId, TransactionType.SALE))
                .thenReturn(List.of(restriction));

        RegistryCheckResponse response = registryDecisionService.checkTransaction(request, actorUserId, institutionId);

        assertNotNull(response);
        assertEquals(RegistryDecision.BLOCKED_BY_VALID_ORDER, response.decision());
        assertEquals(1, response.activeRestrictionCount());
        assertTrue(response.restrictionReferences().contains("ORD-DH-2024-991"));
        verify(registryCheckRepository).save(any(RegistryCheck.class));
        verify(auditService).recordEvent(any(), any(), eq("REGISTRY_CHECK"), any(), any(), any(), any(), any());
    }

    @Test
    void testMortgageRequiresRelease() {
        RegistryCheckRequest request = new RegistryCheckRequest(
                "REQ-002",
                parcelId,
                null, null, null, null, null, null,
                TransactionType.SALE
        );

        when(parcelRepository.findById(parcelId)).thenReturn(Optional.of(mockParcel));
        when(restrictionService.findActiveRestrictionsForTransaction(parcelId, TransactionType.SALE))
                .thenReturn(Collections.emptyList());

        Mortgage mortgage = Mortgage.builder()
                .id(UUID.randomUUID())
                .parcelId(parcelId)
                .lenderInstitutionId(institutionId)
                .lenderReference("MORT-DB-2023-001")
                .status(MortgageStatus.ACTIVE)
                .effectiveFrom(LocalDate.now().minusMonths(6))
                .build();

        when(mortgageRepository.findByParcelIdAndStatus(parcelId, MortgageStatus.ACTIVE))
                .thenReturn(List.of(mortgage));

        RegistryCheckResponse response = registryDecisionService.checkTransaction(request, actorUserId, institutionId);

        assertNotNull(response);
        assertEquals(RegistryDecision.MORTGAGE_REQUIRES_RELEASE, response.decision());
        assertEquals(1, response.activeMortgageCount());
        assertTrue(response.mortgageReferences().contains("MORT-DB-2023-001"));
        verify(registryCheckRepository).save(any(RegistryCheck.class));
    }

    @Test
    void testClear() {
        RegistryCheckRequest request = new RegistryCheckRequest(
                "REQ-003",
                parcelId,
                null, null, null, null, null, null,
                TransactionType.SALE
        );

        when(parcelRepository.findById(parcelId)).thenReturn(Optional.of(mockParcel));
        when(restrictionService.findActiveRestrictionsForTransaction(parcelId, TransactionType.SALE))
                .thenReturn(Collections.emptyList());
        when(mortgageRepository.findByParcelIdAndStatus(parcelId, MortgageStatus.ACTIVE))
                .thenReturn(Collections.emptyList());

        RegistryCheckResponse response = registryDecisionService.checkTransaction(request, actorUserId, institutionId);

        assertNotNull(response);
        assertEquals(RegistryDecision.CLEAR, response.decision());
        assertEquals(0, response.activeRestrictionCount());
        assertEquals(0, response.activeMortgageCount());
        assertNotNull(response.disclaimer());
        verify(registryCheckRepository).save(any(RegistryCheck.class));
    }

    @Test
    void testReviewRequired() {
        UUID unknownParcelId = UUID.randomUUID();
        RegistryCheckRequest request = new RegistryCheckRequest(
                "REQ-004",
                unknownParcelId,
                null, null, null, null, null, null,
                TransactionType.SALE
        );

        when(parcelRepository.findById(unknownParcelId)).thenReturn(Optional.empty());

        RegistryCheckResponse response = registryDecisionService.checkTransaction(request, actorUserId, institutionId);

        assertNotNull(response);
        assertEquals(RegistryDecision.REVIEW_REQUIRED, response.decision());
        assertTrue(response.reasonCodes().contains("PARCEL_NOT_FOUND_OR_AMBIGUOUS"));
        verify(registryCheckRepository).save(any(RegistryCheck.class));
    }

    @Test
    void testSystemUnavailable() {
        RegistryCheckRequest request = new RegistryCheckRequest(
                "REQ-005",
                parcelId,
                null, null, null, null, null, null,
                TransactionType.SALE
        );

        when(parcelRepository.findById(parcelId))
                .thenThrow(new RuntimeException("Database connection timeout"));

        RegistryCheckResponse response = registryDecisionService.checkTransaction(request, actorUserId, institutionId);

        assertNotNull(response);
        assertEquals(RegistryDecision.SYSTEM_UNAVAILABLE, response.decision());
        assertTrue(response.reasonCodes().contains("SYSTEM_ERROR"));
    }
}
