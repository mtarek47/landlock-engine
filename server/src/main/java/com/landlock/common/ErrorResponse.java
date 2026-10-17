package com.landlock.common;

import java.time.Instant;

public record ErrorResponse(
    Instant timestamp,
    int status,
    String code,
    String message,
    String correlationId
) {}
