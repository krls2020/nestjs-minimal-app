# NestJS Minimal — Zerops Recipe App

<!-- #ZEROPS_EXTRACT_START:intro# -->
Minimal [NestJS](https://nestjs.com) application demonstrating framework-native deployment on Zerops. Uses TypeORM for database access, EJS for server-rendered templates, and NestJS modules for clean separation of concerns. Includes an HTML dashboard and JSON health check endpoint, both backed by PostgreSQL.
<!-- #ZEROPS_EXTRACT_END:intro# -->

## Deploy

This app is part of the [NestJS Minimal](https://github.com/krls2020/zerops-recipes/tree/main/nestjs-minimal) recipe on Zerops.

[![Deploy on Zerops](https://github.com/zeropsio/recipe-shared-assets/blob/main/deploy-button/deploy-button.svg?raw=true)](https://app.zerops.io/recipe/nestjs-minimal)

## Endpoints

| Endpoint | Response | Purpose |
|---|---|---|
| `GET /` | HTML dashboard | Shows NestJS version, Node.js version, DB connection status, and a greeting queried from the database |
| `GET /api/health` | JSON `{ status, database }` | Health check — returns 200 when DB is connected, 503 otherwise |

## Tech Stack

- **Node.js 22** + **NestJS 10** (Express platform)
- **TypeORM** with PostgreSQL driver
- **EJS** templates for server-side rendering
- **TypeORM migrations** for schema management

<!-- #ZEROPS_EXTRACT_START:integration-guide# -->
## Integration Guide

How to adapt a default NestJS installation for Zerops deployment.

### 1. Add zerops.yaml

Create `zerops.yaml` at the project root with three setups: `base` (shared config), `prod` (compiled build), and `dev` (source deployment for SSH development). The `extends: base` pattern avoids duplicating environment variables.

Key sections:
- **build**: `npm ci && npm run build` compiles TypeScript, then swap to production-only `node_modules`
- **deploy**: `dist/`, `node_modules`, `package.json`, and `views/` — no source needed at runtime
- **run**: `node dist/main` with health check on `/api/health`

See the [commented zerops.yaml](zerops.yaml) in this repository for the complete configuration.

### 2. Configure Trust Proxy

Zerops routes traffic through an L7 HTTP balancer. Without trust proxy, Express reports incorrect client IPs and protocols:

```typescript
// main.ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set('trust proxy', true);
```

### 3. Wire Database via Environment Variables

Zerops provisions PostgreSQL credentials as environment variables. Use `${db_hostname}`, `${db_port}`, etc. in `zerops.yaml`:

```yaml
envVariables:
  DATABASE_HOST: ${db_hostname}
  DATABASE_PORT: ${db_port}
  DATABASE_NAME: ${db_dbName}
  DATABASE_USERNAME: ${db_user}
  DATABASE_PASSWORD: ${db_password}
```

In your TypeORM configuration, read these from `process.env`:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
})
```

### 4. Run Migrations via `zsc execOnce`

In multi-container deployments, migrations must run exactly once. Use `zsc execOnce` with `${appVersionId}` as the lock key — it ensures one execution per deploy version:

```yaml
initCommands:
  - zsc execOnce ${appVersionId} -- node -e "..."
```

Do **not** set `migrationsRun: true` in TypeORM config — that would run migrations on every container startup, causing race conditions in HA deployments.

<!-- #ZEROPS_EXTRACT_END:integration-guide# -->

<!-- #ZEROPS_EXTRACT_START:knowledge-base# -->
## Tips

### Production Node Modules

The build step swaps `node_modules` to production-only before deploy. This reduces the deployed artifact by ~40% — TypeScript compiler, test frameworks, and linters are not needed at runtime. The swap pattern:

```bash
npm ci                    # all deps (for TypeScript compiler)
npm run build             # compile to dist/
mv node_modules node_modules_dev
npm ci --omit=dev         # production deps only
```

### Health Check vs Readiness Check

Zerops uses two types of checks:
- **readinessCheck** (deploy phase): polls the endpoint before routing traffic. If it fails, the deploy rolls back automatically.
- **healthCheck** (run phase): polls continuously. If it fails, Zerops restarts the container.

Both should hit `/api/health` which verifies the database connection.

### Development Workflow

The `dev` setup deploys source code and idles (`zsc noop`). Connect via SSH and run `npm run start:dev` for hot-reload development. The `zsc scale ram +0.5GB 10m` in initCommands temporarily increases memory for `npm install`.
<!-- #ZEROPS_EXTRACT_END:knowledge-base# -->
