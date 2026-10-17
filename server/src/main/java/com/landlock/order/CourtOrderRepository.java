package com.landlock.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourtOrderRepository extends JpaRepository<CourtOrder, UUID> {
    List<CourtOrder> findByCaseId(UUID caseId);
    List<CourtOrder> findByApprovalStatus(OrderStatus approvalStatus);
    Optional<CourtOrder> findByOrderReference(String orderReference);
}
