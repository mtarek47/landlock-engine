package com.landlock.mortgage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MortgageRepository extends JpaRepository<Mortgage, UUID> {
    List<Mortgage> findByParcelId(UUID parcelId);
    List<Mortgage> findByParcelIdAndStatus(UUID parcelId, MortgageStatus status);
    boolean existsByParcelIdAndStatus(UUID parcelId, MortgageStatus status);
    List<Mortgage> findByLenderInstitutionId(UUID lenderInstitutionId);
    Optional<Mortgage> findByLenderReferenceAndLenderInstitutionId(String lenderReference, UUID lenderInstitutionId);
}
