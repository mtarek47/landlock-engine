package com.landlock.casefile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CaseParcelRepository extends JpaRepository<CaseParcel, UUID> {
    List<CaseParcel> findByCaseId(UUID caseId);
    List<CaseParcel> findByParcelId(UUID parcelId);
    Optional<CaseParcel> findByCaseIdAndParcelId(UUID caseId, UUID parcelId);
}
