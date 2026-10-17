package com.landlock.parcel;

import com.landlock.common.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "land_parcels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandParcel extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "division_code", nullable = false, length = 50)
    private String divisionCode;

    @Column(name = "district_code", nullable = false, length = 50)
    private String districtCode;

    @Column(name = "upazila_code", nullable = false, length = 50)
    private String upazilaCode;

    @Column(name = "mouza_code", nullable = false, length = 100)
    private String mouzaCode;

    @Column(name = "jl_number", length = 50)
    private String jlNumber;

    @Column(name = "khatian_number", nullable = false, length = 100)
    private String khatianNumber;

    @Column(name = "khatian_type", nullable = false, length = 50)
    @Builder.Default
    private String khatianType = "RS";

    @Column(name = "dag_number", nullable = false, length = 100)
    private String dagNumber;

    @Column(name = "sub_parcel_reference", length = 100)
    private String subParcelReference;

    @Column(name = "recorded_area", precision = 15, scale = 4)
    private BigDecimal recordedArea;

    @Column(name = "area_unit", length = 20)
    @Builder.Default
    private String areaUnit = "DECIMAL";

    @Column(name = "source_institution_id")
    private UUID sourceInstitutionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 30)
    @Builder.Default
    private ParcelVerificationStatus verificationStatus = ParcelVerificationStatus.UNVERIFIED;

    @Column(name = "last_verified_at")
    private Instant lastVerifiedAt;

    @Version
    @Column(name = "version", nullable = false)
    @Builder.Default
    private Integer version = 0;
}
