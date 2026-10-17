package com.landlock.order;

public record OrderActionRequest(
    String reason,
    String notes
) {}
