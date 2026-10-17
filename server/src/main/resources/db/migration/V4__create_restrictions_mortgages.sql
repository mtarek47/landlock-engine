CREATE TABLE restrictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID NOT NULL REFERENCES land_parcels(id),
    case_id UUID REFERENCES cases(id),
    court_order_id UUID REFERENCES court_orders(id),
    restriction_type VARCHAR(50) NOT NULL,
    scope_type VARCHAR(50) NOT NULL DEFAULT 'FULL_PARCEL',
    scope_area NUMERIC(15,4),
    scope_share VARCHAR(50),
    applicable_transaction_types VARCHAR(200) NOT NULL DEFAULT 'ALL',
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    effective_from DATE NOT NULL,
    effective_until DATE,
    source_reference VARCHAR(500),
    created_by UUID REFERENCES app_users(id),
    approved_by UUID REFERENCES app_users(id),
    version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE mortgages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID NOT NULL REFERENCES land_parcels(id),
    lender_institution_id UUID NOT NULL REFERENCES institutions(id),
    lender_reference VARCHAR(200) NOT NULL,
    scope_type VARCHAR(50) NOT NULL DEFAULT 'FULL_PARCEL',
    secured_area NUMERIC(15,4),
    secured_share VARCHAR(50),
    effective_from DATE NOT NULL,
    effective_until DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    release_reference VARCHAR(500),
    created_by UUID REFERENCES app_users(id),
    version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_restrictions_parcel ON restrictions(parcel_id);
CREATE INDEX idx_restrictions_status ON restrictions(status);
CREATE INDEX idx_mortgages_parcel ON mortgages(parcel_id);
CREATE INDEX idx_mortgages_status ON mortgages(status);
