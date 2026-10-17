-- ==============================================================================
-- V6__seed_demo_data.sql: Seed Initial Demonstrational Data
-- Password for all demo users is 'demo123'
-- BCrypt hash: $2a$10$rS0v5kXhz5v5mNiUQtxoEuiagfJeM1Y3RyCfSE3PzGY1vL6U9GFq6
-- All names, parcels, cases, and orders are FICTIONAL demo data only.
-- ==============================================================================

-- 1. Institutions
INSERT INTO institutions (id, name, institution_type, external_reference, status, created_at)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'Demo Court of Dhaka', 'COURT', 'CRT-DHAKA-01', 'ACTIVE', NOW()),
    ('20000000-0000-0000-0000-000000000002', 'Land Administration Office (AC Land)', 'LAND_ADMIN', 'ACLAND-DHAKA-01', 'ACTIVE', NOW()),
    ('30000000-0000-0000-0000-000000000003', 'Sub-Registry Office Dhaka Sadar', 'SUB_REGISTRY', 'SRO-DHAKA-01', 'ACTIVE', NOW()),
    ('40000000-0000-0000-0000-000000000004', 'Demo Commercial Bank PLC', 'BANK', 'BNK-DHAKA-01', 'ACTIVE', NOW());

-- 2. Demo Users (password: demo123)
INSERT INTO app_users (id, institution_id, username, password_hash, display_name, email, role, status, created_at)
VALUES
    ('a1000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'court_officer1',
     '$2b$10$c68AY2H8adL5gzbEbMue1uI6EqBeV6WpnIExMRNLv8wvC.1LTXO.O',
     'Court Clerk Tariq', 'court_officer1@demo-court.gov.bd', 'COURT_OFFICER', 'ACTIVE', NOW()),

    ('a2000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'order_approver1',
     '$2b$10$c68AY2H8adL5gzbEbMue1uI6EqBeV6WpnIExMRNLv8wvC.1LTXO.O',
     'Judge / Approver Rahman', 'order_approver1@demo-court.gov.bd', 'ORDER_APPROVER', 'ACTIVE', NOW()),

    ('a3000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'land_officer1',
     '$2b$10$c68AY2H8adL5gzbEbMue1uI6EqBeV6WpnIExMRNLv8wvC.1LTXO.O',
     'AC Land Officer Hasan', 'land_officer1@acland.gov.bd', 'LAND_OFFICER', 'ACTIVE', NOW()),

    ('a4000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000003', 'registry_officer1',
     '$2b$10$c68AY2H8adL5gzbEbMue1uI6EqBeV6WpnIExMRNLv8wvC.1LTXO.O',
     'Sub-Registrar Chowdhury', 'registry_officer1@subreg.gov.bd', 'REGISTRY_OFFICER', 'ACTIVE', NOW()),

    ('a5000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000004', 'bank_officer1',
     '$2b$10$c68AY2H8adL5gzbEbMue1uI6EqBeV6WpnIExMRNLv8wvC.1LTXO.O',
     'Credit Officer Ahmed', 'bank_officer1@demobank.com', 'BANK_OFFICER', 'ACTIVE', NOW()),

    ('a6000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', 'auditor1',
     '$2b$10$c68AY2H8adL5gzbEbMue1uI6EqBeV6WpnIExMRNLv8wvC.1LTXO.O',
     'Chief Inspector Auditor Khan', 'auditor1@gov.bd', 'AUDITOR', 'ACTIVE', NOW()),

    ('a7000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002', 'admin1',
     '$2b$10$c68AY2H8adL5gzbEbMue1uI6EqBeV6WpnIExMRNLv8wvC.1LTXO.O',
     'System Administrator Admin', 'admin@landlock.internal', 'SYSTEM_ADMIN', 'ACTIVE', NOW()),

    ('a8000000-0000-0000-0000-000000000008', NULL, 'citizen1',
     '$2b$10$c68AY2H8adL5gzbEbMue1uI6EqBeV6WpnIExMRNLv8wvC.1LTXO.O',
     'Citizen Karim', 'citizen1@citizen.bd', 'CITIZEN', 'ACTIVE', NOW());

-- 3. Fictional Land Parcels (Dhaka District)
INSERT INTO land_parcels (
    id, division_code, district_code, upazila_code, mouza_code, jl_number,
    khatian_number, khatian_type, dag_number, sub_parcel_reference,
    recorded_area, area_unit, source_institution_id, verification_status,
    last_verified_at, version, created_at, updated_at
) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'DHAKA', 'DHAKA', 'DHANMONDI', 'DHANMONDI-01', '10',
     '101', 'RS', '5001', 'PL-1', 10.5000, 'DECIMAL',
     '20000000-0000-0000-0000-000000000002', 'VERIFIED', NOW(), 0, NOW(), NOW()),

    ('b2000000-0000-0000-0000-000000000002', 'DHAKA', 'DHAKA', 'GULSHAN', 'GULSHAN-02', '15',
     '202', 'RS', '6002', 'PL-2', 15.0000, 'DECIMAL',
     '20000000-0000-0000-0000-000000000002', 'VERIFIED', NOW(), 0, NOW(), NOW()),

    ('b3000000-0000-0000-0000-000000000003', 'DHAKA', 'DHAKA', 'MIRPUR', 'MIRPUR-03', '20',
     '303', 'RS', '7003', 'PL-3', 8.2500, 'DECIMAL',
     '20000000-0000-0000-0000-000000000002', 'VERIFIED', NOW(), 0, NOW(), NOW());

-- 4. Cases
INSERT INTO cases (id, case_number, court_institution_id, case_type, filing_date, case_status, restricted_summary, source_reference, created_by, created_at)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'OS-2024-00123',
     '10000000-0000-0000-0000-000000000001', 'CIVIL_SUIT', '2024-01-15', 'ACTIVE',
     'Title and permanent injunction suit regarding Dhanmondi property',
     'CASE-DOC-123-2024', 'a1000000-0000-0000-0000-000000000001', NOW()),

    ('c2000000-0000-0000-0000-000000000002', 'MS-2024-00456',
     '10000000-0000-0000-0000-000000000001', 'LAND_DISPUTE', '2024-02-10', 'ACTIVE',
     'Boundary and partition dispute regarding Gulshan parcel',
     'CASE-DOC-456-2024', 'a1000000-0000-0000-0000-000000000001', NOW());

-- Case Parcels
INSERT INTO case_parcels (id, case_id, parcel_id, scope_type, scope_area, scope_share, created_at)
VALUES
    ('d1000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
     'FULL_PARCEL', 10.5000, '1.0', NOW()),

    ('d2000000-0000-0000-0000-000000000002',
     'c2000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002',
     'FULL_PARCEL', 15.0000, '1.0', NOW());

-- 5. Court Orders
-- Order 1: APPROVED - blocks SALE on Parcel 1
-- Order 2: DRAFT - pending on Parcel 2
INSERT INTO court_orders (
    id, case_id, order_reference, order_type, order_date, effective_from, effective_until,
    transaction_scope, source_document_reference, verification_status, approval_status,
    approved_by, approved_at, supersedes_order_id, created_by, created_at
) VALUES
    ('e1000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000001', 'ORD-DH-2024-991', 'INJUNCTION',
     '2024-01-20', '2024-01-20', '2027-12-31', 'SALE', 'DOC-INJ-DH-991.pdf',
     'VERIFIED', 'APPROVED',
     'a2000000-0000-0000-0000-000000000002', NOW(), NULL,
     'a1000000-0000-0000-0000-000000000001', NOW()),

    ('e2000000-0000-0000-0000-000000000002',
     'c2000000-0000-0000-0000-000000000002', 'ORD-DH-2024-992', 'INJUNCTION',
     '2024-02-15', '2024-02-15', NULL, 'ALL', 'DOC-INJ-DH-992.pdf',
     'PENDING', 'DRAFT',
     NULL, NULL, NULL,
     'a1000000-0000-0000-0000-000000000001', NOW());

-- 6. Restrictions
-- Active restriction on Parcel 1 blocking SALE
INSERT INTO restrictions (
    id, parcel_id, case_id, court_order_id, restriction_type, scope_type, scope_area, scope_share,
    applicable_transaction_types, status, effective_from, effective_until, source_reference,
    created_by, approved_by, version, created_at, updated_at
) VALUES
    ('f1000000-0000-0000-0000-000000000001',
     'b1000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000001',
     'e1000000-0000-0000-0000-000000000001',
     'COURT_INJUNCTION', 'FULL_PARCEL', 10.5000, '1.0',
     'SALE', 'ACTIVE', '2024-01-20', '2027-12-31', 'ORD-DH-2024-991',
     'a1000000-0000-0000-0000-000000000001',
     'a2000000-0000-0000-0000-000000000002',
     0, NOW(), NOW());

-- 7. Mortgages
-- Active mortgage on Parcel 1
-- Released mortgage on Parcel 3
INSERT INTO mortgages (
    id, parcel_id, lender_institution_id, lender_reference, scope_type,
    secured_area, secured_share, effective_from, effective_until, status,
    release_reference, created_by, version, created_at, updated_at
) VALUES
    ('e0000001-0000-0000-0000-000000000011',
     'b1000000-0000-0000-0000-000000000001',
     '40000000-0000-0000-0000-000000000004',
     'MORT-DB-2023-001', 'FULL_PARCEL',
     10.5000, '1.0', '2023-06-01', NULL, 'ACTIVE',
     NULL, 'a5000000-0000-0000-0000-000000000005', 0, NOW(), NOW()),

    ('e0000002-0000-0000-0000-000000000022',
     'b3000000-0000-0000-0000-000000000003',
     '40000000-0000-0000-0000-000000000004',
     'MORT-DB-2022-099', 'FULL_PARCEL',
     8.2500, '1.0', '2022-05-10', '2023-05-10', 'RELEASED',
     'REL-DB-2023-045', 'a5000000-0000-0000-0000-000000000005', 0, NOW(), NOW());
