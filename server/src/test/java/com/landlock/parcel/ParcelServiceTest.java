package com.landlock.parcel;

import com.landlock.audit.AuditService;
import com.landlock.mortgage.MortgageRepository;
import com.landlock.mortgage.MortgageStatus;
import com.landlock.restriction.RestrictionRepository;
import com.landlock.restriction.RestrictionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParcelServiceTest {

    @Mock
    private ParcelRepository parcelRepository;

    @Mock
    private RestrictionRepository restrictionRepository;

    @Mock
    private MortgageRepository mortgageRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private ParcelService parcelService;

    private UUID parcelId;
    private UUID actorUserId;
    private UUID institutionId;

    @BeforeEach
    void setUp() {
        parcelId = UUID.randomUUID();
        actorUserId = UUID.randomUUID();
        institutionId = UUID.randomUUID();
    }

    @Test
    void testCreateParcel() {
        CreateParcelRequest request = new CreateParcelRequest(
                "DHAKA",
                "DHAKA",
                "DHANMONDI",
                "DHANMONDI-01",
                "10",
                "101",
                "RS",
                "5001",
                "PL-1",
                new BigDecimal("10.50"),
                "DECIMAL",
                institutionId,
                ParcelVerificationStatus.VERIFIED
        );

        when(parcelRepository.save(any(LandParcel.class))).thenAnswer(invocation -> {
            LandParcel p = invocation.getArgument(0);
            p.setId(parcelId);
            return p;
        });

        ParcelDTO created = parcelService.createParcel(request, actorUserId, institutionId);

        assertNotNull(created);
        assertEquals(parcelId, created.id());
        assertEquals("5001", created.dagNumber());
        assertEquals("101", created.khatianNumber());
        verify(parcelRepository).save(any(LandParcel.class));
        verify(auditService).recordEvent(eq(actorUserId), eq(institutionId), eq("CREATE_PARCEL"), eq("LandParcel"), eq(parcelId), any(), any());
    }

    @Test
    void testSearchParcel() {
        LandParcel parcel = LandParcel.builder()
                .id(parcelId)
                .divisionCode("DHAKA")
                .districtCode("DHAKA")
                .upazilaCode("DHANMONDI")
                .mouzaCode("DHANMONDI-01")
                .dagNumber("5001")
                .khatianNumber("101")
                .build();

        when(parcelRepository.searchParcels("DHANMONDI-01", "5001", "101"))
                .thenReturn(List.of(parcel));

        List<ParcelDTO> results = parcelService.searchParcels("DHANMONDI-01", "5001", "101");

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(parcelId, results.get(0).id());
        assertEquals("DHANMONDI-01", results.get(0).mouzaCode());
    }

    @Test
    void testPublicStatusHasActiveRestriction() {
        when(parcelRepository.existsById(parcelId)).thenReturn(true);
        when(restrictionRepository.existsByParcelIdAndStatus(parcelId, RestrictionStatus.ACTIVE)).thenReturn(true);
        when(mortgageRepository.existsByParcelIdAndStatus(parcelId, MortgageStatus.ACTIVE)).thenReturn(false);

        PublicParcelStatus status = parcelService.getPublicStatus(parcelId);

        assertNotNull(status);
        assertEquals(parcelId, status.parcelId());
        assertTrue(status.hasActiveRestriction());
        assertFalse(status.hasActiveMortgage());
        assertNotNull(status.disclaimer());
    }
}
