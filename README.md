# TeamFlow

A production-minded, responsive team task board built for the Full Stack Node.js technical assessment. It includes every core requirement plus Docker, OpenAPI, real-time updates, pagination/search/sorting, and task status audit history.

## Stack and architecture

- React 19 + Vite frontend with responsive project and Kanban views
- Express 5 REST API organized by routes, access policy, validation, and error middleware
- PostgreSQL + Prisma with a committed SQL migration and reproducible seed
- JWT authentication, bcrypt (12 rounds), role-based admin actions, project-level authorization
- Socket.IO rooms scoped to projects for real-time task changes
- Zod validation, Helmet, CORS, JSON size limits, login rate limiting

The browser never decides authorization. Every project/task query is scoped through the authenticated user's membership. Admin role is required for project and membership mutations; any accessible project member may manage its tasks.

## Quick start

Requirements: Node.js 22+, npm, and PostgreSQL 15+.

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:4000`; interactive Swagger documentation is at `http://localhost:4000/api/docs`.

### Seed credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@teamflow.dev` | `Password123!` |
| Member | `member@teamflow.dev` | `Password123!` |

Change all demonstration passwords in a real environment.

## Environment variables

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://teamflow:teamflow@localhost:5432/teamflow?schema=public` |
| `JWT_SECRET` | JWT signing secret (minimum 32 chars) | Generate a random production secret |
| `PORT` | API port | `4000` |
| `CLIENT_URL` | Allowed browser origin | `http://localhost:5173` |
| `VITE_API_URL` | API origin compiled into frontend | `http://localhost:4000` |

## Commands

```bash
npm run dev          # API and web app
npm run build        # strict server TypeScript + production frontend
npm test             # automated backend validation tests
npm run db:migrate   # create/apply development migrations
npm run db:deploy    # apply committed migrations in production
npm run db:seed      # create demo accounts/project/tasks
```

## Docker

```bash
docker compose up --build
docker compose exec app npm run db:seed
```

This starts PostgreSQL and the complete production application at `http://localhost:4000`. The Express process serves the compiled React app as well as the API.

## API overview

All protected requests use `Authorization: Bearer <token>`.

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET|POST /api/projects`, `GET|PATCH|DELETE /api/projects/:projectId`
- `POST|DELETE /api/projects/:projectId/members/:userId`
- `GET /api/projects/:projectId/users`
- `GET|POST /api/projects/:projectId/tasks`
- `GET|PATCH|DELETE /api/projects/:projectId/tasks/:taskId`
- `GET /api/users` (Admin)

Task list parameters: `status`, `priority`, `assigneeId`, `search`, `page`, `limit`, `sort` (`createdAt`, `dueDate`, `title`, `priority`, `status`), and `order` (`asc`, `desc`). Project lists accept `search`, `page`, and `limit`.

Status changes are written atomically to `AuditLog` and returned by the single-task endpoint. Socket clients authenticate during connection, join `project:<id>`, and receive `task:created`, `task:updated`, and `task:deleted`.

## Design decisions and trade-offs

- Registration always creates a Member. Admins come from controlled seed/DB operations, preventing privilege escalation.
- Inaccessible resources return 404 to avoid leaking their existence.
- Project creators cannot be removed from membership.
- Audit records cover status transitions (the assessment's requested scope), not every field edit.
- Public deployment and repository publishing are intentionally left to the submitter because they require external account ownership.

## Production checklist

Use a managed PostgreSQL instance, rotate the JWT secret, enforce HTTPS, configure the exact frontend origin, run `db:deploy`, build with the production `VITE_API_URL`, and put the API behind a reverse proxy. Add refresh-token rotation and external observability if the product scope expands.
