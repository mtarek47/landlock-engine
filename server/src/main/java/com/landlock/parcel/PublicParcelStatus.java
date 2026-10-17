package com.landlock.parcel;

import java.time.Instant;
import java.util.UUID;

public record PublicParcelStatus(
    UUID parcelId,
    boolean hasActiveRestriction,
    boolean hasActiveMortgage,
    Instant lastChecked,
    String disclaimer
) {
    public static final String DEFAULT_DISCLAIMER =
            "DISCLAIMER: This public status represents recorded demonstration and pilot data in the LandLock Engine prototype. " +
            "It does not constitute official title certification or legal warranty of ownership.";

    public static PublicParcelStatus of(UUID parcelId, boolean hasActiveRestriction, boolean hasActiveMortgage) {
        return new PublicParcelStatus(
                parcelId,
                hasActiveRestriction,
                hasActiveMortgage,
                Instant.now(),
                DEFAULT_DISCLAIMER
        );
    }
}
