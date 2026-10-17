package com.landlock.parcel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParcelRepository extends JpaRepository<LandParcel, UUID> {

    List<LandParcel> findByMouzaCodeAndDagNumber(String mouzaCode, String dagNumber);

    List<LandParcel> findByKhatianNumber(String khatianNumber);

    @Query("SELECT p FROM LandParcel p WHERE " +
           "(cast(:mouza as string) IS NULL OR LOWER(p.mouzaCode) LIKE LOWER(CONCAT('%', cast(:mouza as string), '%'))) AND " +
           "(cast(:dag as string) IS NULL OR p.dagNumber = cast(:dag as string)) AND " +
           "(cast(:khatian as string) IS NULL OR p.khatianNumber = cast(:khatian as string))")
    List<LandParcel> searchParcels(
            @Param("mouza") String mouza,
            @Param("dag") String dag,
            @Param("khatian") String khatian
    );

    Optional<LandParcel> findByDivisionCodeAndDistrictCodeAndUpazilaCodeAndMouzaCodeAndDagNumber(
            String divisionCode, String districtCode, String upazilaCode, String mouzaCode, String dagNumber
    );
}
