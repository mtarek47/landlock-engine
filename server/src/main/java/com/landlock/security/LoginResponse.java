package com.landlock.security;

import com.landlock.user.UserDTO;

public record LoginResponse(
    String token,
    String tokenType,
    long expiresInMs,
    UserDTO user
) {
    public static LoginResponse of(String token, long expiresInMs, UserDTO user) {
        return new LoginResponse(token, "Bearer", expiresInMs, user);
    }
}
