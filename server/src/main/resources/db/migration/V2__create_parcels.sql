CREATE TABLE land_parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division_code VARCHAR(50) NOT NULL,
    district_code VARCHAR(50) NOT NULL,
    upazila_code VARCHAR(50) NOT NULL,
    mouza_code VARCHAR(100) NOT NULL,
    jl_number VARCHAR(50),
    khatian_number VARCHAR(100) NOT NULL,
    khatian_type VARCHAR(50) NOT NULL DEFAULT 'RS',
    dag_number VARCHAR(100) NOT NULL,
    sub_parcel_reference VARCHAR(100),
    recorded_area NUMERIC(15,4),
    area_unit VARCHAR(20) DEFAULT 'DECIMAL',
    source_institution_id UUID REFERENCES institutions(id),
    verification_status VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED',
    last_verified_at TIMESTAMPTZ,
    version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parcel_mouza_dag ON land_parcels(mouza_code, dag_number);
CREATE INDEX idx_parcel_khatian ON land_parcels(khatian_number);
