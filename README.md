# TeamFlow

TeamFlow is a full-stack project and task management application built for the Full Stack Node.js Technical Assessment. It provides JWT authentication, role-aware project access, task management, a responsive Kanban board, task filtering and sorting, drag-and-drop status updates, real-time updates, and task status audit history.

## Features

- Register and log in with JWT-based authentication and bcrypt password hashing
- Admin and Member roles; registration creates Members to prevent privilege escalation
- Create, view, edit, and delete projects
- Add or remove project members by email (project owner or Admin)
- Show only projects available to the authenticated user
- Create, view, edit, and delete project tasks
- Task title, description, status, priority, due date, creator, and assignee
- To Do, In Progress, and Done Kanban columns
- Search, filtering, sorting, and pagination
- Drag-and-drop and select-based status updates
- Members may change only the status of tasks assigned to them
- Project owners and Admins manage task details
- Audit history for every task status transition
- Socket.IO project rooms for real-time task refreshes
- Responsive desktop and mobile interface with modal forms
- Centralized API error handling and validation
- Swagger/OpenAPI documentation
- Reproducible database seed and 10 automated backend tests
- Docker Compose development/deployment setup

## Technology

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Socket.IO Client |
| Backend | Node.js, NestJS, Socket.IO, Zod |
| Database | PostgreSQL 17, Prisma ORM |
| Security | JWT, bcrypt (12 rounds), Helmet, CORS |
| Testing | Vitest |
| API documentation | Swagger / OpenAPI |

## Architecture

```text
electropi_task/
├── backend/
│   ├── prisma/              # Prisma schema, migrations, and seed
│   └── src/
│       ├── auth/            # Registration, login, JWT guard
│       ├── projects/        # Project access and membership rules
│       ├── tasks/           # Tasks, status policy, audit log, sockets
│       ├── users/           # Admin user lookup
│       └── main.ts          # CORS, security, Swagger, global errors
├── frontend/
│   └── src/
│       ├── components/      # Shared UI and layout components
│       ├── features/        # Auth, projects, and task UI
│       ├── hooks/           # Project/board data and socket lifecycle
│       ├── pages/           # Login, projects, and board pages
│       └── services/        # API-specific client services
├── docker-compose.yml
├── .env.example
└── package.json             # npm workspace commands
```

The frontend communicates with a REST API and subscribes to project-scoped Socket.IO events. NestJS controllers delegate to services, where authorization is enforced before Prisma accesses PostgreSQL. The browser UI hides unavailable actions for clarity, but the backend remains the source of truth for every permission check.

## Authorization rules

| Action | Project owner/Admin | Member |
|---|---:|---:|
| Create a project | Yes | Yes (becomes owner) |
| Edit/delete an accessible project | Yes | No |
| Add/remove members | Yes | No |
| Create/edit/delete tasks | Yes | No |
| Change any task status | Yes | No |
| Change assigned task status | Yes | Yes |
| View accessible task history | Yes | Yes |

Inaccessible resources return `404` where appropriate to reduce resource-discovery leakage. A project creator cannot be removed from their project.

## Prerequisites

- Node.js 22 or newer
- npm 10 or newer
- PostgreSQL 15 or newer, or Docker Desktop

## Local setup

1. Install dependencies from the repository root:

```bash
npm install
```

2. Copy the sample backend environment file:

```bash
# macOS/Linux
cp .env.example backend/.env

# Windows PowerShell
Copy-Item .env.example backend/.env
```

3. Start PostgreSQL. The simplest option is the included database container:

```bash
docker compose up -d db
```

Alternatively, create a local PostgreSQL database and update `DATABASE_URL` in `backend/.env`.

4. Generate Prisma Client, apply the committed migration, and seed the database:

```bash
npm run db:generate
npm run db:deploy
npm run db:seed
```

Use `npm run db:migrate` only while developing new schema migrations.

5. Start the backend and frontend together:

```bash
npm run dev
```

Open:

- Frontend: <http://localhost:5173>
- API: <http://localhost:4000/api>
- Swagger UI: <http://localhost:4000/api/docs>
- OpenAPI JSON: <http://localhost:4000/api/docs-json>

## Environment variables

The committed [.env.example](./.env.example) contains placeholders only. Never commit `backend/.env` or production credentials.

| Variable | Required | Used by | Description | Local example |
|---|---:|---|---|---|
| `DATABASE_URL` | Yes | Backend/Prisma | PostgreSQL connection string | `postgresql://teamflow:teamflow@localhost:5432/teamflow?schema=public` |
| `JWT_SECRET` | Yes | Backend | JWT signing key, minimum 32 characters | Replace the placeholder with a random secret |
| `PORT` | No | Backend | HTTP API port; defaults to `4000` | `4000` |
| `CLIENT_URL` | No | Backend | Production frontend origin; local origins are allowed in development | `http://localhost:5173` |
| `VITE_API_URL` | No | Frontend | Public API origin embedded at frontend build time | `http://localhost:4000` |

For a non-default frontend API URL, create `frontend/.env` containing `VITE_API_URL=...`. Docker passes this value as a frontend build argument.

## Database and seed accounts

Run the seed at any time to restore the two demonstration users, roles, passwords, project memberships, and sample project:

```bash
npm run db:seed
```

| Role | Name | Email | Password |
|---|---|---|---|
| Admin | Amina Admin | `admin@teamflow.dev` | `Password123!` |
| Member | Moe Member | `member@teamflow.dev` | `Password123!` |

The seed is idempotent. These credentials are for assessment/demo use only and must be changed for a real deployment.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Run NestJS and Vite in watch mode |
| `npm run build` | Build backend and frontend for production |
| `npm test` | Run all backend automated tests |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create/apply a development migration |
| `npm run db:deploy` | Apply committed migrations without prompts |
| `npm run db:seed` | Create/reset demonstration accounts and sample data |
| `npm run lint --workspace frontend` | Lint the React application |

## Automated tests

```bash
npm test
```

The suite currently contains 10 tests across two files. It covers authentication validation plus critical task authorization and audit behavior, including assigned-task status updates, rejection of unauthorized task changes, Admin detail changes, and audit record creation.

## API documentation

Interactive Swagger documentation is generated by the running backend:

- Swagger UI: <http://localhost:4000/api/docs>
- OpenAPI document: <http://localhost:4000/api/docs-json>

Select **Authorize** in Swagger and enter the JWT returned by `POST /api/auth/login` to call protected endpoints.

### Endpoint summary

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a Member |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Get the authenticated user |
| `GET`, `POST` | `/api/projects` | List/search/page projects or create one |
| `GET`, `PATCH`, `DELETE` | `/api/projects/:id` | Read or manage a project |
| `POST` | `/api/projects/:id/members` | Add a registered user by email body |
| `DELETE` | `/api/projects/:id/members/:userId` | Remove a member |
| `GET` | `/api/projects/:id/users` | List assignable project members |
| `GET`, `POST` | `/api/projects/:projectId/tasks` | Query or create tasks |
| `GET`, `PATCH`, `DELETE` | `/api/projects/:projectId/tasks/:taskId` | Read or manage a task |
| `GET` | `/api/projects/:projectId/tasks/:taskId/audit` | Read status-change history |
| `GET` | `/api/users` | Search users as an Admin |

Task queries support `search`, `status`, `priority`, `assigneeId`, `sort`, `order`, `page`, and `limit`. Project queries support `search`, `page`, and `limit`.

## Docker Compose

Build and run PostgreSQL, the backend, and the Nginx-served frontend:

```bash
docker compose up --build
docker compose exec backend npm run db:seed
```

Then open <http://localhost:5173>. The backend container applies committed Prisma migrations during startup.

Stop the services without deleting database data:

```bash
docker compose down
```

To intentionally remove the local Docker database volume as well:

```bash
docker compose down -v
```

## Centralized error handling

The global NestJS exception filter returns consistent responses for validation failures (`422`), authorization and other HTTP exceptions, Prisma unique conflicts (`409`), and unexpected server failures (`500`). The frontend uses one API client to parse field errors, authentication errors, and network failures consistently.

## Deployment

No public deployment URL is included yet. A Render Blueprint is included at `render.yaml` and provisions PostgreSQL, the NestJS API, and the React static site together.

### Deploy on Render

1. Commit and push the latest repository files, including `render.yaml`.
2. Sign in to [Render](https://dashboard.render.com) using GitHub.
3. Select **New > Blueprint**.
4. Connect and select `hussien103/electropi-task`.
5. Render detects `render.yaml`; review the three resources and select **Apply**.
6. Wait for `teamflow-db`, `teamflow-api`, and `teamflow-web` to finish deploying.
7. Open the `teamflow-web` URL and test both seeded accounts.
8. Open `https://<teamflow-api-host>/api/docs` to verify Swagger.

The Blueprint generates `JWT_SECRET`, uses the database's internal connection string, applies migrations, seeds the reviewer accounts, connects frontend/API origins, and enables automatic deployment after future commits. Free Render services may take time to wake after inactivity.

After deployment, replace the placeholders below and commit the real links:

```text
Live frontend: https://teamflow-web-xxxx.onrender.com
API documentation: https://teamflow-api-xxxx.onrender.com/api/docs
Reviewer accounts: use the seeded Admin and Member credentials above
```

For another production provider:

1. Provision a managed PostgreSQL database.
2. configure `DATABASE_URL`, a new strong `JWT_SECRET`, and the exact `CLIENT_URL` on the backend host.
3. Run `npm run db:deploy` before starting the API.
4. Build the frontend with `VITE_API_URL` set to the public HTTPS API origin.
5. Serve both applications over HTTPS.
6. Add the frontend URL and any reviewer access details to this section before submission.

## Submission checklist

- [ ] Publish the repository or grant the reviewer access
- [x] Complete setup and architecture documentation
- [x] Safe `.env.example` without real secrets
- [x] PostgreSQL migration and reproducible seed
- [x] Swagger/OpenAPI documentation
- [x] Admin and Member test credentials
- [x] At least five meaningful automated tests (10 included)
- [ ] Add public live URLs if deployed
