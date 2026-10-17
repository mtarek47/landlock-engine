CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(200) NOT NULL UNIQUE,
    court_institution_id UUID REFERENCES institutions(id),
    case_type VARCHAR(50) NOT NULL,
    filing_date DATE NOT NULL,
    case_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    restricted_summary TEXT,
    source_reference VARCHAR(500),
    created_by UUID REFERENCES app_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE case_parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id),
    parcel_id UUID NOT NULL REFERENCES land_parcels(id),
    scope_type VARCHAR(50) NOT NULL DEFAULT 'FULL_PARCEL',
    scope_area NUMERIC(15,4),
    scope_share VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE court_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id),
    order_reference VARCHAR(200) NOT NULL,
    order_type VARCHAR(50) NOT NULL,
    order_date DATE NOT NULL,
    effective_from DATE NOT NULL,
    effective_until DATE,
    transaction_scope VARCHAR(50) NOT NULL DEFAULT 'ALL',
    source_document_reference VARCHAR(500),
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    approval_status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    approved_by UUID REFERENCES app_users(id),
    approved_at TIMESTAMPTZ,
    supersedes_order_id UUID REFERENCES court_orders(id),
    created_by UUID REFERENCES app_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_court_orders_case ON court_orders(case_id);
CREATE INDEX idx_court_orders_status ON court_orders(approval_status);
