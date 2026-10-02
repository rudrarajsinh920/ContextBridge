# ContextBridge Architecture Document

## Overview

ContextBridge is engineered as an AI-powered project continuity platform that transforms scattered notes, specifications, architecture decisions, and code history into structured, evidence-backed knowledge.

---

## Architectural Principles & Guardrails

1. **Incremental Progression:**  
   Every layer is built on solid, tested foundations. Features such as AI inference, document ingestion, and authentication are deliberately isolated until foundational infrastructure and data entities are verified.

2. **Zero Fake AI / Grounded Truth:**  
   The platform strictly prohibits mock AI generators or synthetic data that simulates real analytics. Every insight synthesized in future phases must reference a concrete evidence anchor.

3. **Autonomous Component Decoupling:**  
   The frontend (`client/`) and backend (`server/`) maintain separate package dependencies, separate build configurations, and communicate exclusively over typed HTTP REST contracts.

4. **Honest User Experience:**  
   Buttons that do not have active backend operations are omitted. Empty states are explicitly articulated with clear architectural roadmap milestones rather than dead-end controls.

5. **Strict Schema & Parameter Validation:**  
   All entity mutations and queries pass through middleware guards validating MongoDB ObjectId formatting and preventing unmodeled or unexpected fields from reaching database layers.

---

## System Layering

### 1. Frontend (`client/`)
- **Framework:** React 19 + TypeScript
- **Styling Architecture:** Tailwind CSS utility tokens with responsive layout breakpoints.
- **Component Hierarchy:**
  - `AppLayout`: Root responsive layout managing desktop sidebar navigation and mobile accessible drawer.
  - `Sidebar`: Keyboard-friendly navigation linking Dashboard, Projects, and Documents views.
  - `Header`: Top navigation landmark displaying active context breadcrumbs, API telemetry, and live MongoDB status.
  - `Pages`:
    - `DashboardPage`: Real-time service and database telemetry display with architectural roadmap.
    - `ProjectsPage`: Fully interactive Project workspace manager connected to the Express & MongoDB REST API (loading states, empty states, creation modal, edit modal, delete confirmation dialog).
    - `DocumentsPage`: Document corpus architecture and upcoming ingestion pipeline blueprint.
- **API Client:** Typed service functions (`fetchProjects`, `createProject`, `updateProject`, `deleteProject`, `fetchHealthStatus`).

### 2. Backend (`server/`)
- **Runtime:** Node.js (ESM / NodeNext)
- **Framework:** Express 4 with modular controllers and routers.
- **Data Layer:** MongoDB via Mongoose.
  - `Project` schema: `name` (required, trimmed, 1-100 chars), `description` (optional, <=1000 chars), `status` (`active` | `archived`), automatic `createdAt` / `updatedAt` timestamps.
  - Connection manager: Reusable connector (`connectDatabase`, `disconnectDatabase`, `isDatabaseConnected`, `getDatabaseTelemetry`) with sanitized credential logging.
- **Middleware Pipeline:**
  1. `cors`: Configurable CORS with client origin whitelisting.
  2. `express.json()` & `express.urlencoded()`: Typed body parsers.
  3. `requestLogger`: Timestamped request duration and HTTP status tracking.
  4. `validateObjectId`: Guards all `:id` endpoints against malformed hex strings.
  5. `validateCreateProject` / `validateUpdateProject`: Rejects unexpected unmodeled fields and enforces string constraints.
  6. `routes`: Aggregated API endpoints under `/api` (`/api/health`, `/api/projects`).
  7. `notFoundHandler`: Catches unmatched routes and yields structured 404 responses.
  8. `errorHandler`: Centralized error handler yielding consistent JSON error structures.

---

## Phase Roadmap

- **Phase 1 (Completed):** Foundational structure, independent frontend & backend setups, live telemetry endpoint, responsive SaaS shell, strict TypeScript & build validation.
- **Phase 2 (Completed):** MongoDB & Mongoose connection, Project entity schema, full Project CRUD API endpoints, automated 24-test integration suite, interactive frontend ProjectsPage with complete lifecycle operations.
- **Phase 3 (Upcoming):** Document ingestion pipeline (Markdown / text parser, character offset anchoring, evidence ledger).
- **Phase 4:** AI synthesis engine with verifiable citations and interactive context query interface.
