package com.landlock.parcel;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ParcelDTO(
    UUID id,
    String divisionCode,
    String districtCode,
    String upazilaCode,
    String mouzaCode,
    String jlNumber,
    String khatianNumber,
    String khatianType,
    String dagNumber,
    String subParcelReference,
    BigDecimal recordedArea,
    String areaUnit,
    UUID sourceInstitutionId,
    ParcelVerificationStatus verificationStatus,
    Instant lastVerifiedAt,
    Integer version,
    Instant createdAt,
    Instant updatedAt
) {
    public static ParcelDTO fromEntity(LandParcel parcel) {
        if (parcel == null) {
            return null;
        }
        return new ParcelDTO(
                parcel.getId(),
                parcel.getDivisionCode(),
                parcel.getDistrictCode(),
                parcel.getUpazilaCode(),
                parcel.getMouzaCode(),
                parcel.getJlNumber(),
                parcel.getKhatianNumber(),
                parcel.getKhatianType(),
                parcel.getDagNumber(),
                parcel.getSubParcelReference(),
                parcel.getRecordedArea(),
                parcel.getAreaUnit(),
                parcel.getSourceInstitutionId(),
                parcel.getVerificationStatus(),
                parcel.getLastVerifiedAt(),
                parcel.getVersion(),
                parcel.getCreatedAt(),
                parcel.getUpdatedAt()
        );
    }
}
