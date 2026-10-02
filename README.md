# ContextBridge

> **AI-Powered Project Continuity Platform**  
> Bridging scattered project notes, decisions, documents, and tasks into structured, evidence-backed knowledge.

---

## 1. Product Purpose

Engineering projects naturally suffer from context decay: critical design decisions, architecture trade-offs, and rationale are fragmented across pull requests, chat threads, tickets, and disparate documents. When a teammate joins or context shifts, re-accumulating that background requires weeks of unstructured inquiry.

**ContextBridge** solves this by:
- Acting as a centralized project continuity workspace.
- Organizing architecture decision records, specifications, and discussions into coherent project boundaries.
- Adhering to a strict **Evidence-Backed Truth** principle: every synthesized insight links directly to verifiable source artifacts, with zero hallucinations or ungrounded assertions.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS (consistent design tokens, accessible components, responsive layouts)
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (v20+ / v24+)
- **Framework:** Express 4 + TypeScript
- **Database:** MongoDB with Mongoose
- **Configuration:** Dotenv (typed configuration module)
- **Middleware:** Centralized error handling, CORS, structured request logging, strict input validators
- **Execution & Watcher:** `tsx` for TypeScript execution without compilation delay

---

## 3. Folder Structure

```text
ContextBridge/
├── client/                     # Frontend SPA (React + Vite + Tailwind CSS)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Modular, reusable UI components
│   │   │   ├── common/         # Badge, Card, EmptyState design tokens
│   │   │   └── layout/         # AppLayout, Sidebar, Header
│   │   ├── pages/              # View pages (Dashboard, Projects, Documents)
│   │   ├── services/           # Backend API integration (health check & Project CRUD)
│   │   ├── types/              # TypeScript models and navigation interfaces
│   │   ├── App.tsx             # Root application orchestrator
│   │   ├── index.css           # Base styles and Tailwind layer directives
│   │   ├── main.tsx            # DOM entry point
│   │   └── vite-env.d.ts       # Vite client environment typings
│   ├── index.html              # HTML shell with accessibility metadata
│   ├── package.json            # Client dependencies and scripts
│   ├── postcss.config.js       # PostCSS plugins (Tailwind, Autoprefixer)
│   ├── tailwind.config.js      # Design tokens and theme extension
│   ├── tsconfig.json           # Client TypeScript configuration
│   └── vite.config.ts          # Vite build and dev server configuration
│
├── server/                     # Backend API (Express + TypeScript + Mongoose)
│   ├── src/
│   │   ├── config/             # Typed environment & MongoDB connection modules
│   │   │   ├── database.ts     # Reusable Mongoose connector & telemetry
│   │   │   └── environment.ts  # Typed environment config
│   │   ├── controllers/        # Route controllers (health & Project CRUD)
│   │   │   ├── healthController.ts
│   │   │   └── projectController.ts
│   │   ├── middleware/         # Error handling, request logger, input validation
│   │   │   ├── errorHandler.ts
│   │   │   ├── requestLogger.ts
│   │   │   └── validate.ts     # ObjectId & project payload validators
│   │   ├── models/             # Mongoose schemas
│   │   │   └── Project.ts      # Project entity model
│   │   ├── routes/             # Express API routes (aggregated under /api)
│   │   │   ├── healthRoutes.ts
│   │   │   ├── projectRoutes.ts
│   │   │   └── index.ts
│   │   ├── tests/              # Automated integration tests
│   │   │   └── projectCrud.test.ts # 24 integration tests
│   │   ├── app.ts              # Express application factory and middleware wiring
│   │   └── server.ts           # Server bootstrap and graceful shutdown
│   ├── .env                    # Local environment variables (git-ignored)
│   ├── .env.example            # Environment template
│   ├── package.json            # Server dependencies and scripts
│   └── tsconfig.json           # NodeNext TypeScript configuration
│
├── docs/                       # Architecture documentation and roadmap
│   └── ARCHITECTURE.md         # Architectural decisions and phase roadmap
│
├── .gitignore                  # Root Git ignore rules
└── README.md                   # Project documentation
```

---

## 4. Installation & Database Setup Instructions

### Prerequisites
- **Node.js**: v20.0.0 or higher (v24 recommended)
- **npm**: v10.0.0 or higher
- **MongoDB**: A running MongoDB instance (locally via Community Server / Docker, or MongoDB Atlas cloud cluster).

### Step 1: Environment Variables Setup
In the `server/` directory, copy the template `.env.example` to `.env`:
```bash
cd server
cp .env.example .env
```

Edit `server/.env` to configure your MongoDB connection string:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/contextbridge
```
> **Security Note:** `.env` is explicitly ignored by Git in `.gitignore`. Never commit database credentials or connection secrets to version control.

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm install
```

---

## 5. Development Commands

### Backend Server (`/server`)

| Command | Description |
|---|---|
| `npm run dev` | Starts server in watch mode using `tsx` at `http://localhost:5000` |
| `npm test` | Runs the automated 24-test integration suite using in-memory MongoDB |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm start` | Runs compiled production server from `dist/server.js` |
| `npm run typecheck` | Runs TypeScript compiler checks without emitting files |

### Frontend Application (`/client`)

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite development server at `http://localhost:5173` |
| `npm run build` | Validates types with `tsc` and bundles production assets into `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm run typecheck` | Validates TypeScript types across the client codebase |

---

## 6. API Specifications (Milestone 2)

### Health Check Telemetry

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns server telemetry and accurate MongoDB connection state (`ok` with HTTP 200, or `degraded` with HTTP 503 if DB is disconnected). |

### Project CRUD Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/projects` | Creates a new project. Validates required `name` (1-100 chars), optional `description` (<= 1000 chars), and `status` (`active` \| `archived`). Rejects unmodeled fields. |
| `GET` | `/api/projects` | Returns list of all projects ordered by newest first. |
| `GET` | `/api/projects/:id` | Returns single project by ObjectId. Returns 400 for invalid ID format, 404 if not found. |
| `PATCH` | `/api/projects/:id` | Updates project fields. Rejects empty body, unexpected fields, and invalid status values. |
| `DELETE` | `/api/projects/:id` | Deletes project by ObjectId. Returns 404 if not found. |

---

## 7. Architectural Guardrails Followed

1. **Incremental Progression:** Milestone 1 foundations preserved; Milestone 2 introduces Mongoose data persistence and project boundaries cleanly.
2. **Authentic Telemetry:** The health endpoint and frontend reflect genuine live connection state and Node.js process metrics.
3. **Strict Input Sanitization:** Unexpected fields are rejected at the middleware boundary; credentials are masked in logs.
4. **Resilient Error Responses:** Centralized error handling guarantees uniform JSON responses with appropriate HTTP status codes (200, 201, 400, 404, 503).
