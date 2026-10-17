CREATE TABLE registry_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(200) NOT NULL,
    requesting_institution_id UUID NOT NULL REFERENCES institutions(id),
    parcel_id UUID REFERENCES land_parcels(id),
    transaction_type VARCHAR(50) NOT NULL,
    decision VARCHAR(50) NOT NULL,
    reason_codes TEXT,
    data_freshness TIMESTAMPTZ,
    correlation_id VARCHAR(100),
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    response_summary TEXT,
    UNIQUE(request_id, requesting_institution_id)
);

CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES app_users(id),
    institution_id UUID REFERENCES institutions(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    reason TEXT,
    correlation_id VARCHAR(100),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    change_summary TEXT
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID NOT NULL REFERENCES app_users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_events(actor_user_id);
CREATE INDEX idx_notifications_user ON notifications(recipient_user_id);
