package com.landlock.casefile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CaseFileRepository extends JpaRepository<CaseFile, UUID> {
    Optional<CaseFile> findByCaseNumber(String caseNumber);
    List<CaseFile> findByCourtInstitutionId(UUID courtInstitutionId);
    List<CaseFile> findByCaseStatus(CaseStatus caseStatus);
}
