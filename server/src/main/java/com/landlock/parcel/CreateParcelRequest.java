package com.landlock.parcel;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.UUID;

public record CreateParcelRequest(
    @NotBlank(message = "Division code is required")
    String divisionCode,

    @NotBlank(message = "District code is required")
    String districtCode,

    @NotBlank(message = "Upazila code is required")
    String upazilaCode,

    @NotBlank(message = "Mouza code is required")
    String mouzaCode,

    String jlNumber,

    @NotBlank(message = "Khatian number is required")
    String khatianNumber,

    String khatianType,

    @NotBlank(message = "Dag number is required")
    String dagNumber,

    String subParcelReference,

    BigDecimal recordedArea,

    String areaUnit,

    UUID sourceInstitutionId,

    ParcelVerificationStatus verificationStatus
) {}
