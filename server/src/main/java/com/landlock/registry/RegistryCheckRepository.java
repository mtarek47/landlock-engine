package com.landlock.registry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RegistryCheckRepository extends JpaRepository<RegistryCheck, UUID> {
    Optional<RegistryCheck> findByRequestIdAndRequestingInstitutionId(String requestId, UUID requestingInstitutionId);
    List<RegistryCheck> findByParcelIdOrderByCheckedAtDesc(UUID parcelId);
    List<RegistryCheck> findByRequestingInstitutionIdOrderByCheckedAtDesc(UUID requestingInstitutionId);
}
