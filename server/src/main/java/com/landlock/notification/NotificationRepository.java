package com.landlock.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(UUID recipientUserId);
    List<Notification> findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(UUID recipientUserId);
    long countByRecipientUserIdAndReadFalse(UUID recipientUserId);
}
