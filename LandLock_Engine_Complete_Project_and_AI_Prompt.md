# LandLock Engine
## Complete Project Specification, Architecture, Implementation Plan & AI Coding Prompt

**Project name:** LandLock Engine  
**Full name:** Automated Injunction & Title Encumbrance Registry  
**Tagline:** Secure Land. Transparent Ownership. A Fairer Bangladesh.  
**Project type:** E-Governance / GovTech / LegalTech  
**Target context:** Bangladesh  
**Document purpose:** Hackathon-ready project blueprint and implementation prompt for an AI coding agent.

---

## 1. Executive Summary

LandLock Engine is a proposed inter-departmental land-risk verification and encumbrance coordination platform. It aims to help authorized institutions record and verify court orders, land disputes, injunctions, and registered mortgage/lien information against identifiable land parcels.

The system connects the workflows of:
- Civil courts and land tribunals
- AC Land / land administration offices
- Sub-registry offices
- Banks and financial institutions
- Citizens and prospective buyers

When an authorized officer records a legally relevant order or verified encumbrance, the platform associates it with the affected land parcel and calculates the parcel's current status according to configured rules. During a simulated or authorized registration workflow, the registry verification API checks that status and returns a decision such as **CLEAR**, **REVIEW_REQUIRED**, or **BLOCKED_BY_VALID_ORDER**.

The public portal provides carefully scoped status information so a prospective buyer can identify relevant risk indicators before proceeding. It must not expose confidential case documents, personal data, or privileged institutional information.

**Important legal and operational boundary:** A case being filed does not automatically mean that all land mentioned in the case is legally prohibited from transfer. Only an applicable law, valid court order, authorized administrative action, or verified encumbrance—within its actual scope—should trigger a legal restriction. In the prototype, all records are demonstration data and all integrations are simulated. Real registry blocking requires government authorization, legal validation, identity verification, and official integration.

---

## 2. Problem Statement

Land transactions can involve fragmented records across courts, land administration, sub-registry offices, and lenders. Where systems cannot reliably exchange timely, verified information, buyers and lenders may face risks such as:
- Transfer attempts involving land subject to a relevant injunction or restriction
- Duplicate or conflicting mortgage claims
- Delayed discovery of a dispute or encumbrance
- Inconsistent land identifiers across offices
- Difficulty proving who changed a status and under what authority
- Limited pre-transaction visibility for citizens

LandLock Engine proposes a shared verification layer with parcel identification, authority-based workflows, controlled data access, auditable status changes, and integration APIs.

Do not claim a specific national percentage of land disputes unless a reliable, cited source is added to the final presentation.

---

## 3. Goals and Non-Goals

### 3.1 Goals
1. Represent land parcels using structured identifiers.
2. Record cases, court orders, administrative restrictions, and mortgage/lien records.
3. Associate each restriction with the exact parcel or ownership share covered by the source order.
4. Provide a reliable status-check API for registry and bank workflows.
5. Support authorized lock, review, expiry, modification, and release workflows.
6. Provide a citizen-facing pre-transaction risk-check portal.
7. Maintain a tamper-evident, append-only audit trail for critical events.
8. Demonstrate role-based access, approval, validation, and concurrent-request safety.
9. Build a working hackathon MVP with simulated institutional integrations.

### 3.2 Non-Goals for the Hackathon MVP
- Direct connection to live government databases
- Actual legal prohibition of a property transfer
- Authenticating real court orders against official court systems
- Replacing existing land records or legally authoritative registries
- Determining ownership or resolving title disputes automatically
- Using AI to make legal decisions
- Guaranteeing that a parcel is fraud-free solely because the prototype returns CLEAR

---

## 4. Users and Roles

Use role-based access control (RBAC). Never trust a role supplied by the frontend; derive permissions from the authenticated server-side identity.

| Role | Main permissions |
|---|---|
| `SYSTEM_ADMIN` | Manage configuration, users, institutions, and integration settings; cannot silently rewrite historical audit entries |
| `COURT_OFFICER` | Create case records and submit court orders for verification/approval |
| `ORDER_APPROVER` | Approve, reject, amend, or release a restriction based on authorized source documents |
| `LAND_OFFICER` | Manage permitted land reference records and submit administrative verification |
| `REGISTRY_OFFICER` | Request transaction checks and view the decision/reason relevant to registration |
| `BANK_OFFICER` | Register or update verified mortgage/lien records for the institution's authorized scope |
| `AUDITOR` | Read audit events and compliance reports without modifying business records |
| `CITIZEN` | Search public parcel status and view non-confidential risk summaries |
| `DEMO_USER` | Use seeded demonstration workflows only |

For a hackathon demo, provide clearly labelled demo accounts. Do not add a production “default admin password.” Use environment variables or a documented first-run admin bootstrap process.

---

## 5. Core Functional Modules

### 5.1 Land Parcel Registry
Store structured references for:
- Division, district, upazila, and mouza
- JL number where applicable
- Khatian number and type
- Dag/plot number
- Parcel subdivision or share where applicable
- Recorded land area and unit
- Reference/source institution
- Verification status and last verified timestamp

A dag number alone is not guaranteed to identify one unique, transferable legal interest. Use a composite identifier and support a parcel/share scope. Keep identifiers as strings where leading zeros or local formatting matter.

### 5.2 Case and Court Order Management
- Create a case record with case number, court, parties (restricted access), case type, and dates.
- Upload or reference a source document in the demo environment.
- Capture the order's exact scope, affected parcels/shares, effective date, expiry/review date if present, and source authority.
- Track status: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `AMENDED`, `EXPIRED`, `RELEASED`.
- Require approval by a permitted role before an order affects the registry decision.
- Preserve prior versions and record every amendment/release as a new event.
- Do not let the AI infer whether a document is legally valid.

### 5.3 Restriction / Lock State Engine
Represent individual restrictions separately from the computed parcel status.

Suggested restriction types:
- `COURT_INJUNCTION`
- `COURT_TRANSFER_RESTRICTION`
- `ADMINISTRATIVE_RESTRICTION`
- `MORTGAGE_LIEN`
- `DISPUTE_REVIEW_FLAG`
- `OTHER_VERIFIED_ENCUMBRANCE`

Suggested restriction lifecycle:
`DRAFT -> PENDING_VERIFICATION -> ACTIVE -> (EXPIRED | RELEASE_PENDING -> RELEASED | SUPERSEDED)`

Only an authorized and approved record can become `ACTIVE`. Expiry must not silently erase the historical record. A release requires the correct authority and evidence.

Suggested computed transaction statuses:
- `CLEAR` — no known active restriction in the connected/available dataset; this is not a title guarantee.
- `REVIEW_REQUIRED` — data mismatch, unverified record, incomplete parcel identity, or non-blocking risk indicator.
- `BLOCKED_BY_VALID_ORDER` — an approved, effective, applicable order explicitly prohibits the requested transaction.
- `MORTGAGE_REQUIRES_RELEASE` — an active verified lien exists and the required release/consent is absent.
- `SYSTEM_UNAVAILABLE` — verification could not be completed; never treat this as CLEAR.

Do not hard-code that every litigation record blocks every transfer. Decision logic must consider order scope, transaction type, effective dates, approval state, parcel/share coverage, and configured legal rules. For the demo, document the exact simulated rules.

### 5.4 Sub-Registry Gatekeeper API
Provide a REST endpoint for a registry workflow to check a proposed transaction before registration.

Example:
`POST /api/v1/registry/checks`

Request fields:
- `requestId` (idempotency key)
- `transactionType` (`SALE`, `GIFT`, `MORTGAGE`, `LEASE`, `OTHER`)
- `parcelId` or complete structured parcel reference
- `ownershipShare` or affected area where applicable
- `requestingInstitutionId`
- `requestedBy` (derived from authentication; do not trust a client-supplied identity)

Response fields:
- `checkId`
- `decision`
- `reasonCodes`
- `checkedAt`
- `dataFreshness`
- `applicableRestrictionReferences` (only what the caller is permitted to see)
- `disclaimer`

The prototype must **simulate** registry blocking. It should never pretend that it has disabled an actual government registration system.

### 5.5 Bank Mortgage Verification
- Register a mortgage/lien only for a verified parcel/share and authorized lender.
- Store lender, reference number, effective date, secured scope, status, release conditions, and evidence reference.
- Prevent duplicate active liens only where they conflict under the configured demo rules; do not assume all multiple liens are automatically unlawful.
- Require an authorized release/consent record before returning a mortgage transaction as clear when one is required.
- Restrict one bank from seeing another bank's confidential loan details; expose only the minimum permitted verification result.

### 5.6 Citizen Title Transparency Portal
Citizen can search by a composite parcel reference (mouza, khatian, dag and location fields). Display:
- Search result and identity-match confidence/status
- Publicly disclosable risk summary
- Whether a relevant restriction or lien indicator exists
- Last verification timestamp and connected-data coverage
- A clear message that the result is not a legal title certificate

Never show confidential case files, personal identifiers, internal notes, bank account details, private parties' sensitive data, or privileged documents to unauthenticated users.

### 5.7 Notifications
For the MVP, use in-app notifications and optional email adapter placeholders. Trigger notifications for:
- Order submitted, approved, rejected, amended, or released
- Restriction activated or expired
- Registry check blocked or marked for review
- Mortgage recorded or released

Avoid sending sensitive case details in email notifications.

### 5.8 Audit and Compliance
Record critical events:
- Actor, role, institution, timestamp
- Action and target record
- Before/after status or a safe structured change summary
- Reason and source reference
- Request/correlation ID
- Approval chain
- Integrity metadata where feasible

Audit records must be append-only at the application level. Restrict database permissions and document that a normal database hash chain is tamper-evident, not a substitute for independent secure logging, backups, and legal evidence controls.

---

## 6. Recommended Technology Stack

### Backend
- Java 21
- Spring Boot 3.x (choose a supported stable release at implementation time)
- Spring Web for REST APIs
- Spring Security
- Spring Data JPA / Hibernate
- Bean Validation
- Spring Boot Actuator with protected health/metrics endpoints
- Flyway for database migrations
- OpenAPI / springdoc for API documentation
- JUnit 5, Mockito, and Testcontainers

### Frontend
- React + Vite + JavaScript
- React Router
- TanStack Query or a consistent API-state approach
- Tailwind CSS + shadcn/ui (or another consistent component system)
- React Hook Form + Zod for client-side forms; repeat all validation on the server
- Leaflet for map visualization if useful

### Data and Infrastructure
- PostgreSQL
- PostGIS for optional spatial mapping
- Docker and Docker Compose for local development
- Nginx as reverse proxy in a deployment setup
- Linux server
- GitHub Actions or equivalent CI
- Object storage adapter for source documents; local storage may be used only for local demo development

### Authentication
- Spring Security with OIDC integration; Keycloak is a suitable identity provider for the demo.
- For a small hackathon MVP, a secure Spring Security session/JWT setup can be used if implemented correctly. Do not build custom cryptography or invent a token format.

### Architecture decision
Start with a **modular monolith**, not microservices. Keep clear module boundaries so the project can later split into services if real integration volume and organizational needs justify it.

---

## 7. High-Level Architecture

```text
React Web Applications
  ├── Court / Order Portal
  ├── Land Administration Portal
  ├── Sub-Registry Portal
  ├── Bank Verification Portal
  ├── Citizen Portal
  └── System Administration / Audit
            |
            v
Spring Boot REST API
  ├── Identity & Access
  ├── Parcel Registry
  ├── Case & Order Management
  ├── Restriction State Engine
  ├── Registry Verification
  ├── Mortgage / Lien Management
  ├── Citizen Transparency
  ├── Notifications
  └── Audit & Reporting
            |
            v
PostgreSQL (+ PostGIS where needed)
  ├── Land reference records
  ├── Cases and source references
  ├── Orders and restrictions
  ├── Mortgage / lien records
  ├── Verification checks
  ├── Audit events
  └── Outbox / integration events (optional)
```

External institutional systems should connect through adapters with authentication, authorization, schema validation, idempotency, retries, timeouts, and audit logs. In the hackathon version, implement mock adapters and label them clearly as simulated.

---

## 8. Suggested Database Model

Use UUID primary keys. Use timestamps with time zone. Use foreign keys, check constraints, unique constraints, and indexes deliberately. Prefer explicit status enums or constrained values.

### `institutions`
- `id`
- `name`
- `institution_type`
- `external_reference`
- `status`
- `created_at`

### `users`
- `id`
- `institution_id`
- `identity_subject`
- `display_name`
- `email` (optional)
- `status`
- `created_at`

Authentication secrets should not be stored here if an external identity provider is used.

### `land_parcels`
- `id`
- `division_code`
- `district_code`
- `upazila_code`
- `mouza_code`
- `jl_number` (nullable where not applicable)
- `khatian_number`
- `khatian_type`
- `dag_number`
- `sub_parcel_reference` (nullable)
- `recorded_area`
- `area_unit`
- `source_institution_id`
- `verification_status`
- `last_verified_at`
- `created_at`
- `updated_at`

Do not assume a composite text reference alone is universally unique. Add uniqueness constraints only when supported by the source-data rules.

### `ownership_interests` (demo/reference data only)
- `id`
- `parcel_id`
- `owner_reference` (privacy-safe internal identifier)
- `share_numerator`
- `share_denominator`
- `area_share`
- `source_reference`
- `verification_status`
- `valid_from`
- `valid_to`

Do not treat prototype ownership records as legally authoritative.

### `cases`
- `id`
- `case_number`
- `court_institution_id`
- `case_type`
- `filing_date`
- `case_status`
- `restricted_summary`
- `source_reference`
- `created_by`
- `created_at`

### `case_parcels`
- `id`
- `case_id`
- `parcel_id`
- `scope_type`
- `scope_area` (nullable)
- `scope_share` (nullable)
- `scope_notes` (restricted)
- `created_at`

### `court_orders`
- `id`
- `case_id`
- `order_reference`
- `order_type`
- `order_date`
- `effective_from`
- `effective_until` (nullable)
- `transaction_scope`
- `source_document_reference`
- `verification_status`
- `approval_status`
- `approved_by`
- `approved_at`
- `supersedes_order_id` (nullable)
- `created_at`

### `restrictions`
- `id`
- `parcel_id`
- `case_id` (nullable)
- `court_order_id` (nullable)
- `restriction_type`
- `scope_type`
- `scope_area` (nullable)
- `scope_share` (nullable)
- `transaction_types` (normalized child table or JSON only if justified)
- `status`
- `effective_from`
- `effective_until` (nullable)
- `source_reference`
- `created_by`
- `approved_by`
- `created_at`
- `updated_at`

### `mortgages`
- `id`
- `parcel_id`
- `lender_institution_id`
- `lender_reference`
- `scope_type`
- `secured_area` (nullable)
- `secured_share` (nullable)
- `effective_from`
- `effective_until` (nullable)
- `status`
- `release_reference` (nullable)
- `created_at`
- `updated_at`

### `registry_checks`
- `id`
- `request_id` (unique idempotency key in caller scope)
- `requesting_institution_id`
- `parcel_id` (nullable if matching failed)
- `transaction_type`
- `decision`
- `reason_codes`
- `data_freshness`
- `correlation_id`
- `checked_at`
- `response_summary`

### `audit_events`
- `id`
- `actor_user_id` (nullable for system actor)
- `institution_id`
- `action`
- `entity_type`
- `entity_id`
- `reason`
- `correlation_id`
- `occurred_at`
- `change_summary`
- `previous_hash` / `event_hash` (optional demo integrity chain)

Never put unnecessary sensitive personal data or full confidential documents into general audit messages.

### `source_documents`
- `id`
- `document_type`
- `storage_key`
- `checksum`
- `uploaded_by`
- `institution_id`
- `verification_status`
- `created_at`

Store files outside the web root. Enforce access checks before downloads. Validate file size/type and scan files in production.

### Database rules
- Use Flyway migrations; do not rely on automatic schema generation in production.
- Use indexes for parcel lookup, active restriction lookup, order status, mortgage status, and audit queries.
- Use transactions for state transitions and registry decisions.
- Use row-level security only as an additional layer where useful; application authorization remains mandatory.
- Ensure idempotency and concurrency handling for repeated registry requests.
- Keep a clear data-retention and correction policy.

---

## 9. API Design

Prefix: `/api/v1`

### Authentication / session
- `GET /auth/me`
- OIDC endpoints managed by the identity provider or configured Spring Security flow.

### Parcels
- `POST /parcels` — authorized data entry
- `GET /parcels/{id}` — permission-controlled details
- `GET /parcels/search` — exact/composite parcel lookup
- `GET /parcels/{id}/public-status` — scoped public status

### Cases and orders
- `POST /cases`
- `GET /cases/{id}`
- `POST /cases/{id}/parcels`
- `POST /cases/{id}/orders`
- `POST /orders/{id}/submit`
- `POST /orders/{id}/approve`
- `POST /orders/{id}/reject`
- `POST /orders/{id}/amend`
- `POST /orders/{id}/release`

Use explicit workflow actions instead of allowing arbitrary status updates through a generic PATCH.

### Restrictions
- `GET /parcels/{id}/restrictions`
- `POST /restrictions`
- `POST /restrictions/{id}/submit`
- `POST /restrictions/{id}/approve`
- `POST /restrictions/{id}/release`

### Registry
- `POST /registry/checks`
- `GET /registry/checks/{id}`

### Mortgages
- `POST /mortgages`
- `GET /mortgages/{id}` (scope-limited)
- `POST /mortgages/{id}/release`
- `POST /mortgages/verify`

### Audit / administration
- `GET /audit/events` — auditor/admin only
- `GET /health` — minimal public health status
- Protected management/metrics endpoints must not be publicly exposed.

### Error response
Use a consistent format such as:
```json
{
  "timestamp": "2026-10-16T12:00:00Z",
  "status": 409,
  "code": "RESTRICTION_ACTIVE",
  "message": "The requested transaction requires authorized review.",
  "correlationId": "..."
}
```
Do not return stack traces, SQL, secrets, internal document URLs, or sensitive case details.

---

## 10. Registry Decision Logic

Implement a dedicated domain service, e.g. `RegistryDecisionService`. It should return a structured decision with reason codes and applicable record references.

Recommended decision order:
1. Authenticate the caller and verify the institution's permission for the transaction type.
2. Validate and resolve the parcel identifier. If ambiguous or unmatched, return `REVIEW_REQUIRED`.
3. Check source data freshness and integration health. If verification cannot be completed, return `SYSTEM_UNAVAILABLE` or `REVIEW_REQUIRED`, never `CLEAR`.
4. Load effective, approved restrictions that apply to the exact parcel/share and requested transaction.
5. If an applicable valid order explicitly prohibits the transaction, return `BLOCKED_BY_VALID_ORDER`.
6. If an active mortgage/lien requires a release or consent that is not recorded, return `MORTGAGE_REQUIRES_RELEASE`.
7. If unresolved identity mismatches or unverified risk flags remain, return `REVIEW_REQUIRED`.
8. Otherwise return `CLEAR`, accompanied by a disclaimer and data-coverage timestamp.

The actual order of precedence and legal meaning must be validated by legal/domain experts before production. In case of conflicting orders or unclear scope, prefer `REVIEW_REQUIRED`, not an invented legal conclusion.

### Concurrency and integrity
- Run the check against a consistent database snapshot/transaction.
- Use unique idempotency keys scoped to the calling institution.
- Prevent concurrent writes from bypassing required checks.
- Revalidate immediately before a simulated commit/registration confirmation.
- Use optimistic locking (`@Version`) or suitable row locks for critical state changes.
- Do not claim that a check API alone can eliminate fraud; source accuracy, legal authority, and institutional adoption are also required.

---

## 11. Security Requirements

Treat security as a core feature, not a later enhancement.

1. Enforce server-side RBAC and institution/tenant boundaries.
2. Use HTTPS in deployment; secure cookies or properly validated OIDC/JWT flows.
3. Apply CSRF protection when using cookie-based sessions.
4. Validate all inputs and reject malformed or ambiguous identifiers.
5. Use parameterized queries and ORM-safe query construction.
6. Rate-limit public search and sensitive endpoints.
7. Protect against IDOR/BOLA: users must not access records merely by guessing UUIDs.
8. Apply least-privilege database and service accounts.
9. Keep secrets in environment variables or a secret manager; never commit secrets.
10. Redact personal data from logs.
11. Validate uploaded files, enforce limits, store outside web root, and authorize downloads.
12. Use audit events for all privileged state changes.
13. Require separation of duties for high-impact order approval/release.
14. Use safe CORS settings; never allow arbitrary origins in production.
15. Configure secure headers and safe error responses.
16. Add dependency scanning and basic CI tests.
17. Back up data and test restoration.
18. Treat integration timeouts as unavailable, never as a successful CLEAR result.
19. Use signed or independently verifiable source references where official integration supports them.
20. Document threat assumptions and security limitations.

---

## 12. Frontend Pages

### Public / Citizen
- Landing page with explanation and disclaimer
- Parcel search form
- Search result with status, timestamp, coverage, reason summary
- “How to verify before buying land” information page

### Institutional dashboard
- Role-aware dashboard
- Recent activities and pending approvals
- Case/order list and detail page
- Parcel association form
- Restriction timeline
- Mortgage/lien verification page
- Registry check page with decision and reason codes
- Notifications

### Administration / Auditor
- User and institution management
- Role assignment
- Integration health overview
- Audit event search
- Demo-data reset only in a protected development/demo environment

### UI requirements
- Professional government-service design
- Responsive desktop/tablet/mobile layouts
- Accessible contrast, keyboard navigation, visible labels and error messages
- Clear distinction between `CLEAR`, `REVIEW_REQUIRED`, `BLOCKED`, and `SYSTEM_UNAVAILABLE`
- Do not use green “safe” status without a visible data coverage/freshness disclaimer
- Avoid implying that the prototype is an official Bangladesh government service

---

## 13. Hackathon MVP Scope

Build a complete, demonstrable vertical slice rather than many unfinished features.

### MVP must include
1. Seeded fictional land parcels and institutions.
2. Login with at least three demo roles: Court Officer, Registry Officer, Citizen.
3. Court officer can create a case/order and associate it with a parcel.
4. An approver can approve or reject a proposed restriction.
5. Approved, applicable demo restrictions change the computed transaction decision.
6. Registry officer can submit a transaction check and see decision/reason.
7. Citizen can search a parcel and see a limited risk summary.
8. Mortgage/lien record and release flow with simulated lender role, if time allows.
9. Audit trail for critical state transitions.
10. API documentation, tests, Docker Compose, and clear demo instructions.

### Demo scenario
- Create fictional parcel `MOUZA-DEMO / KHATIAN-5678 / DAG-1234`.
- Court Officer submits an order that applies to a specified transaction type and parcel scope.
- Order Approver approves the order.
- Registry Officer checks a sale transaction and receives `BLOCKED_BY_VALID_ORDER` with a non-confidential reason.
- Citizen searches the parcel and sees a public “Relevant restriction recorded” warning, last verification time, and legal disclaimer.
- Demonstrate that an unauthorized user cannot approve or release the order.
- Demonstrate that an unavailable verification service returns an unavailable/review result, never `CLEAR`.

All names, parcel numbers, cases, banks, and orders used in the demo must be clearly fictional.

---

## 14. Testing Plan and Acceptance Criteria

### Unit tests
- Valid order scope blocks only matching transaction types and parcel scope.
- Unapproved, rejected, expired, or released orders do not act as active restrictions.
- Partial-share restrictions do not incorrectly block unrelated shares under the configured rules.
- Unclear parcel identity returns `REVIEW_REQUIRED`.
- Active mortgage requires release/consent when the demo rules require it.
- Expired restrictions remain in audit history.
- State transitions reject unauthorized or invalid actions.

### Integration tests
- REST validation and error response format
- Database transaction behavior
- Idempotency for repeated registry requests
- Role/institution access boundaries
- Concurrent check and restriction-update behavior
- Database migrations from an empty database
- Document download authorization

### End-to-end tests
- Court order → approval → registry check → citizen status
- Rejected order → registry check
- Release/amendment → re-check
- Unavailable integration → fail-closed response
- Unauthorized approval/release attempt

### MVP acceptance checklist
- [ ] `docker compose up --build` starts the documented local environment.
- [ ] Database schema is created by Flyway migrations.
- [ ] Seed data is fictional and repeatable.
- [ ] Role-specific pages and backend permissions work.
- [ ] Every critical state change creates an audit event.
- [ ] Registry checks return structured decisions and reason codes.
- [ ] Public responses do not leak confidential records.
- [ ] A failed check never returns `CLEAR`.
- [ ] Automated tests cover the main decision rules.
- [ ] README includes setup, demo credentials/bootstrap, architecture, limitations, and API docs.
- [ ] The UI clearly labels all institutional connections as simulated.

---

## 15. Suggested Repository Structure

```text
landlock-engine/
├── README.md
├── PROJECT_SPEC.md
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/landlock/
│       │   ├── LandLockApplication.java
│       │   ├── config/
│       │   ├── security/
│       │   ├── common/
│       │   ├── institution/
│       │   ├── parcel/
│       │   ├── casefile/
│       │   ├── order/
│       │   ├── restriction/
│       │   ├── registry/
│       │   ├── mortgage/
│       │   ├── citizen/
│       │   ├── audit/
│       │   └── notification/
│       └── main/resources/
│           ├── application.yml
│           └── db/migration/
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── app/
        ├── api/
        ├── components/
        ├── layouts/
        ├── features/
        │   ├── auth/
        │   ├── parcels/
        │   ├── cases/
        │   ├── orders/
        │   ├── restrictions/
        │   ├── registry/
        │   ├── mortgages/
        │   ├── citizen/
        │   └── audit/
        └── pages/
```

Keep modules organized by business domain. Do not put all controllers, entities, or services into a single giant package.

---

## 16. Implementation Roadmap

### Phase 1 — Foundation
- Create repository and development conventions.
- Configure Spring Boot, React/Vite, PostgreSQL, Docker Compose, and Flyway.
- Implement health check, error handling, logging, and API documentation.
- Seed fictional institutions and parcels.

### Phase 2 — Identity and parcel records
- Add authentication and role-based authorization.
- Implement parcel creation/search and validation.
- Add institution-scoped access rules.

### Phase 3 — Order and restriction workflow
- Implement case and order records.
- Add submit/approve/reject/amend/release actions.
- Add explicit state transitions and audit events.
- Implement scope-aware restriction evaluation.

### Phase 4 — Registry and mortgage verification
- Build registry-check API and UI.
- Add idempotency and transaction/concurrency safeguards.
- Add mortgage/lien and release workflow.
- Add simulated external integration adapters.

### Phase 5 — Citizen portal
- Add public search with rate limits.
- Return minimal, non-confidential risk information.
- Add coverage/freshness indicators and disclaimer.

### Phase 6 — Quality and presentation
- Write unit, integration, and end-to-end tests.
- Verify fail-closed behavior.
- Complete responsive UI and demo scenario.
- Add README, architecture diagram, API docs, and pitch materials.

---

## 17. Deployment Guidance

For a hackathon:
- Use Docker Compose for frontend, backend, and PostgreSQL.
- Keep all secrets in `.env`, with `.env.example` containing placeholders only.
- Bind database ports to localhost unless external access is specifically needed.
- Use persistent volumes for local development data.
- Seed only fictional data.
- Add health checks and structured logs.

For a production proposal:
- Use a government-approved hosting environment and identity system.
- Establish legal authority, data-sharing agreements, data classification, retention, and correction policies.
- Use network segmentation, centralized monitoring, backup/restore testing, key management, incident response, and security review.
- Define source-of-truth ownership for each record type.
- Specify service-level objectives, data freshness expectations, outage behavior, and manual fallback processes.
- Obtain legal and institutional approval before enabling any real registry block.

---

## 18. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Incorrect parcel matching | Composite identifiers, source verification, ambiguity review |
| False restriction | Human approval, source evidence, scope-aware rules, appeal/correction workflow |
| Stale data | Freshness timestamps, source health indicators, fail-closed checks |
| Unauthorized lock/release | RBAC, separation of duties, MFA where available, audit trail |
| Insider tampering | Append-only audit design, independent log export, restricted privileges |
| Cross-bank data exposure | Institution-scoped authorization and minimal disclosure |
| API outage during registration | `SYSTEM_UNAVAILABLE`, safe manual escalation, never assume CLEAR |
| Legal overreach | Validate legal rules with qualified authorities; no automatic legal interpretation |
| Overengineering | Modular monolith first; add infrastructure only when needed |
| Misleading hackathon claims | Clearly label mock data and simulated integrations |

---

## 19. Hackathon Pitch Summary

**LandLock Engine is a proposed land-risk verification layer that connects authorized court orders and verified encumbrance records to pre-transaction checks.** It helps institutional users identify relevant restrictions before proceeding with a land transaction and gives citizens a limited, transparent way to check recorded risk indicators. Its core principles are parcel-scope accuracy, authorized decisions, auditability, privacy, and safe handling of missing or stale data.

**Demonstration claim:** “In our prototype, an approved simulated order associated with a fictional parcel causes the registry verification API to return a block decision for the matching transaction.”

Do not claim that the prototype is connected to government systems, legally blocks real transfers, or guarantees title validity.

---

# 20. Complete AI Coding Agent Prompt

Copy the prompt below into your coding agent (Antigravity, Cursor, Claude Code, or another repository-aware coding assistant). Give the agent access to the project workspace.

---

## PROMPT START

You are a senior software architect, Java/Spring Boot engineer, React engineer, database designer, application-security engineer, and test engineer. Build a working hackathon MVP named **LandLock Engine — Automated Injunction & Title Encumbrance Registry**.

### A. Product objective

Build a professional, secure, role-based web application that demonstrates how authorized court-order records and verified mortgage/lien records can be associated with fictional land parcels and checked before a simulated registry transaction.

The application must include:
1. A React/Vite web frontend using JavaScript.
2. A Java 21 + Spring Boot backend.
3. PostgreSQL database with Flyway migrations.
4. Spring Security authentication and server-side authorization.
5. Parcel search and parcel record management.
6. Case and court-order workflows.
7. An explicit, scope-aware restriction state engine.
8. A simulated sub-registry transaction verification API.
9. A mortgage/lien verification and release workflow.
10. A citizen portal that exposes only approved public status information.
11. Audit events for critical actions.
12. Tests, Docker Compose, OpenAPI documentation, and complete setup instructions.

This is a demo, not an official government service. Use fictional data and simulated institutional adapters. Do not connect to real government or financial systems, and do not claim that actual registration can be blocked.

### B. Required stack

Backend:
- Java 21
- A currently supported stable Spring Boot 3.x release
- Maven
- Spring Web
- Spring Security
- Spring Data JPA
- Bean Validation
- PostgreSQL driver
- Flyway
- OpenAPI / Swagger UI
- JUnit 5, Mockito, and Testcontainers

Frontend:
- React + Vite + JavaScript (not TypeScript)
- React Router
- Tailwind CSS with a consistent component library such as shadcn/ui, configured for the JavaScript project
- A consistent API client layer
- React Hook Form and Zod where appropriate
- Leaflet only if the map adds value to the demo

Infrastructure:
- Docker Compose
- PostgreSQL
- `.env.example`
- Optional Keycloak OIDC integration if it can be configured cleanly without delaying the MVP. If not, implement a standard, well-documented Spring Security authentication flow and do not invent custom cryptography.

Use compatible dependency versions. Do not blindly copy outdated setup commands.

### C. Architecture rules

Use a **modular monolith**. Organize backend packages by business domain:
- `security`
- `institution`
- `parcel`
- `casefile`
- `order`
- `restriction`
- `registry`
- `mortgage`
- `citizen`
- `audit`
- `notification`
- `common`

Use controller → service/domain logic → repository separation. Keep controllers thin. Use DTOs rather than exposing JPA entities directly. Add centralized exception handling and validation. Use database migrations for all schema changes. Do not use microservices, Kubernetes, Kafka, or blockchain for this MVP unless a concrete requirement emerges.

### D. Roles and authorization

Implement these roles:
- `SYSTEM_ADMIN`
- `COURT_OFFICER`
- `ORDER_APPROVER`
- `LAND_OFFICER`
- `REGISTRY_OFFICER`
- `BANK_OFFICER`
- `AUDITOR`
- `CITIZEN`

Enforce permissions on the backend, not only in the UI. Enforce institution-level data boundaries. A court officer may submit an order but must not approve their own order if separation of duties is required by the configured demo policy. A registry officer may check a transaction but cannot create or release a court restriction. A citizen may only see the public status response. Auditors may read permitted audit records but cannot modify business data.

Provide an explicit local-demo bootstrap procedure. Do not hard-code production credentials or commit real secrets. If demo credentials are provided for local use, clearly mark them as development-only and require them to be changed or disabled for deployment.

### E. Domain model

Implement migrations and entities for at least:
- `institutions`
- `users` or identity-to-user mapping
- `land_parcels`
- `cases`
- `case_parcels`
- `court_orders`
- `restrictions`
- `mortgages`
- `registry_checks`
- `audit_events`
- `source_documents` metadata if document upload is included

Use UUID IDs, timezone-aware timestamps, foreign keys, sensible indexes, and constraints. Keep parcel identifiers structured: division, district, upazila, mouza, JL number when applicable, khatian number/type, dag number, and optional subdivision/share. Treat land identifiers as strings where formatting/leading zeros matter.

Do not assume that a dag number alone is globally unique. Do not treat demo ownership data as legally authoritative. Avoid storing unnecessary sensitive personal data.

### F. Restriction and order workflow

Use explicit state-transition methods. Do not allow users to set arbitrary status strings.

Suggested order states:
`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `AMENDED`, `EXPIRED`, `RELEASED`.

Suggested restriction states:
`DRAFT`, `PENDING_VERIFICATION`, `ACTIVE`, `RELEASE_PENDING`, `RELEASED`, `EXPIRED`, `SUPERSEDED`.

A restriction becomes active only after the required source verification and authorized approval. Store the effective period, exact parcel/share scope, applicable transaction types, source reference, and approving actor. Amendments and releases must preserve historical records and produce audit events.

Do not assume every filed case blocks every land transaction. For the demo, document the simulated rule that an approved, effective order blocks only the parcel/share and transaction types explicitly in its scope. Ambiguous scope must result in `REVIEW_REQUIRED`, not an invented legal decision.

### G. Registry decision service

Implement a dedicated `RegistryDecisionService` that returns:
- `CLEAR`
- `REVIEW_REQUIRED`
- `BLOCKED_BY_VALID_ORDER`
- `MORTGAGE_REQUIRES_RELEASE`
- `SYSTEM_UNAVAILABLE`

The service must:
1. Validate the caller's role and institution permissions.
2. Resolve the parcel using structured identifiers.
3. Return `REVIEW_REQUIRED` if the parcel match is ambiguous or important data is unverified.
4. Check data freshness and simulated integration health.
5. Evaluate approved, effective restrictions by transaction type and exact parcel/share scope.
6. Return `BLOCKED_BY_VALID_ORDER` only for an applicable, valid simulated order that explicitly restricts the requested transaction.
7. Return `MORTGAGE_REQUIRES_RELEASE` when the configured demo rules require mortgage release/consent and it is missing.
8. Return `REVIEW_REQUIRED` when conflicting records or unclear scope exist.
9. Return `SYSTEM_UNAVAILABLE` when verification cannot be completed.
10. Return `CLEAR` only when the configured checks succeed, while including data freshness and a disclaimer that CLEAR is not a title guarantee.

A failed, timed-out, stale, or unavailable verification must never silently become `CLEAR`.

Use database transactions, idempotency keys scoped to the requesting institution, and suitable locking/versioning for concurrent critical changes. Revalidate before the simulated transaction is finalized. Avoid race conditions between checking a transaction and activating a restriction.

### H. Required API endpoints

Use `/api/v1` prefix and document them in Swagger/OpenAPI. Implement appropriate request/response DTOs and validation.

At minimum:
- `GET /api/v1/auth/me`
- `POST /api/v1/parcels`
- `GET /api/v1/parcels/search`
- `GET /api/v1/parcels/{id}`
- `GET /api/v1/parcels/{id}/public-status`
- `POST /api/v1/cases`
- `GET /api/v1/cases/{id}`
- `POST /api/v1/cases/{id}/parcels`
- `POST /api/v1/cases/{id}/orders`
- `POST /api/v1/orders/{id}/submit`
- `POST /api/v1/orders/{id}/approve`
- `POST /api/v1/orders/{id}/reject`
- `POST /api/v1/orders/{id}/amend`
- `POST /api/v1/orders/{id}/release`
- `POST /api/v1/registry/checks`
- `GET /api/v1/registry/checks/{id}`
- `POST /api/v1/mortgages`
- `POST /api/v1/mortgages/{id}/release`
- `POST /api/v1/mortgages/verify`
- `GET /api/v1/audit/events` (auditor/admin only)

Use explicit action endpoints for approval, rejection, amendment, and release. Do not expose a generic endpoint that lets users patch any workflow status. Return consistent errors with HTTP status, stable error code, safe message, timestamp, and correlation ID. Never return stack traces or SQL details to the client.

### I. Frontend requirements

Create a polished, professional, responsive interface. Use a restrained government-service visual language with deep green, white, neutral backgrounds, readable typography, consistent spacing, and clear status indicators. Avoid gradients, decorative emoji, and excessive animation.

Pages:
1. Public landing page explaining the proposal and limitations.
2. Login page / demo role entry.
3. Role-aware dashboard.
4. Parcel search and details.
5. Court case and order list/detail.
6. Order submission and approval screens.
7. Restriction timeline.
8. Registry transaction check page.
9. Mortgage/lien list, verification, and release screen.
10. Citizen public-status search and result.
11. Audit viewer for authorized roles.
12. Basic user/institution administration for system admin.

Every page must use real API calls, loading states, empty states, validation errors, and safe error messages. Do not build a static mock UI that only looks functional. If a feature is not implemented, label it as unavailable or out of scope rather than making a fake success claim.

Show clear decision labels and human-readable reason codes. Public results must not reveal confidential case documents, private party details, bank loan data, or internal notes. Display verification time and data coverage prominently. Add a disclaimer: “This demonstration is not an official title certificate or legal opinion.”

### J. Demo seed data and required walkthrough

Create fictional seed data for:
- One demo court institution
- One land administration institution
- One sub-registry institution
- One fictional bank
- Demo users with the required roles
- At least three fictional parcels
- One approved restriction applying to one parcel and one transaction type
- One pending/rejected order
- One active mortgage/lien and one released mortgage/lien

Never use real people's personal data or imply that the seeded records are official.

The demo walkthrough must be:
1. Court Officer creates a case and submits an order for a fictional parcel.
2. Order Approver reviews and approves it, with separation of duties enforced.
3. Registry Officer checks a sale for that parcel and receives `BLOCKED_BY_VALID_ORDER`.
4. Citizen searches the parcel and sees only a safe public warning and timestamp.
5. Registry Officer checks a different, unrestricted fictional parcel and receives `CLEAR` with a disclaimer.
6. An unauthorized user attempts approval/release and is denied.
7. Simulate an unavailable verification source and prove the result is not `CLEAR`.
8. Show the audit trail for the approval and registry check.

### K. Testing requirements

Write meaningful tests, not placeholder tests:
- Unit tests for order scope, transaction types, effective dates, approval status, expiry, release, mortgage requirements, ambiguous parcel matches, and unavailable data.
- Authorization tests for each high-impact workflow action.
- Integration tests using a real PostgreSQL test container where practical.
- Idempotency test for repeated registry requests.
- Concurrency test or a documented automated test for competing state changes.
- API validation/error format tests.
- Public-response privacy tests.
- Flyway migration test from an empty database.

### L. Security requirements

- No secrets in source control.
- Server-side authorization for every sensitive endpoint.
- Institution-scoped access controls.
- Safe CORS configuration.
- CSRF protection when using cookie-based sessions.
- Rate limits on public search and sensitive endpoints.
- Safe upload/download controls if files are supported.
- No sensitive data in general logs.
- Parameterized queries.
- Protected Actuator/metrics endpoints.
- Least-privilege database configuration.
- Audit every privileged status change.
- No trust in frontend-supplied roles or actor identity.
- Do not use blockchain or AI as a substitute for legal verification or data integrity controls.

### M. Developer experience and deliverables

Create:
- `README.md` with architecture, prerequisites, setup, migrations, demo bootstrap, test commands, and troubleshooting.
- `PROJECT_SPEC.md` containing the main project specification.
- `docker-compose.yml`
- `.env.example` with placeholders only
- Backend Maven project
- Frontend Vite project
- Flyway migration scripts
- Fictional seed-data strategy
- OpenAPI/Swagger documentation
- Unit and integration tests
- A clear API examples section
- A brief threat model and limitations section

Add a root-level script or documented commands to start the full local demo. Verify that the commands match the actual files and ports. Do not claim tests passed unless you ran them and observed the results.

### N. Work process

1. Inspect the existing repository before changing anything.
2. If the workspace is empty, scaffold the project.
3. Write a concise implementation plan and repository structure.
4. Implement one vertical slice at a time: parcel lookup → order workflow → decision service → registry UI → citizen UI.
5. After each slice, run relevant tests/builds and fix failures.
6. Keep code readable, modular, and commented where the domain rules are non-obvious.
7. Do not leave critical TODOs, fake buttons, hard-coded successful API responses, or unimplemented security checks in the MVP.
8. If a requirement is too large, implement the safest working subset and document the limitation rather than pretending it is complete.
9. At the end, summarize what was implemented, commands to run, test results actually observed, known limitations, and next steps.

**Priority order:** correctness of legal-scope simulation → server-side security → auditability → reliable decision API → usable frontend → visual polish.

Begin by inspecting the repository and then implement the project.

## PROMPT END

---

## 21. Final Build Advice

Do not try to build the entire national platform in one sprint. Deliver a working vertical slice with fictional data, correct permissions, an auditable order-approval flow, and a reliable registry decision API first. The project's strongest demonstration is not the number of screens; it is showing that the system blocks only when the configured, approved order actually applies, returns review/unavailable states safely, and preserves a traceable history of every privileged action.
