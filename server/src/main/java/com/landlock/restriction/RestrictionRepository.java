package com.landlock.restriction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RestrictionRepository extends JpaRepository<Restriction, UUID> {
    List<Restriction> findByParcelId(UUID parcelId);
    List<Restriction> findByParcelIdAndStatus(UUID parcelId, RestrictionStatus status);
    boolean existsByParcelIdAndStatus(UUID parcelId, RestrictionStatus status);
    List<Restriction> findByCourtOrderId(UUID courtOrderId);
}
