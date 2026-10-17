package com.landlock.user;

import com.landlock.security.Role;

import java.time.Instant;
import java.util.UUID;

public record UserDTO(
    UUID id,
    UUID institutionId,
    String username,
    String displayName,
    String email,
    Role role,
    UserStatus status,
    Instant createdAt
) {
    public static UserDTO fromEntity(AppUser user) {
        if (user == null) {
            return null;
        }
        return new UserDTO(
                user.getId(),
                user.getInstitutionId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}
