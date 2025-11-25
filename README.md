# Day One Content Operations

Monorepo used while following lessons on sanity.io/learn. Built around Sanity Studio, a Next.js 16 frontend, and a small Sanity SDK app.

## Tech stack

- [x] `pnpm` workspace monorepo (`pnpm-workspace.yaml` with `apps/*`)
- [x] Node.js >= 20, pnpm >= 10 (see root `package.json` engines)
- [x] Sanity Studio (`apps/studio`) with multi-workspace setup (`site-1`, `site-2`)
- [x] Next.js 16 App Router frontend (`apps/web`)
- [x] Example Sanity SDK React app (`apps/tickets`)
- [x] Biome for formatting/linting (root `pnpm biome`)
- [ ] Test runner (none configured yet)

## Apps

- [x] `apps/studio` – Sanity Studio
  - [x] Dev server: `pnpm dev`
  - [x] Build: `pnpm build`
  - [x] Deploy Studio: `pnpm deploy`
  - [x] Deploy GraphQL API: `pnpm deploy-graphql`
  - [x] Schema/type generation: `pnpm typegen` (also run automatically before dev/build)
  - [x] Env vars (see `apps/studio/lib/env.ts`):
    - `SANITY_STUDIO_PROJECT_ID`
    - `SANITY_STUDIO_DATASET`
    - `SANITY_STUDIO_HOSTNAME`
    - `SANITY_STUDIO_FRONTEND_HOST`

- [x] `apps/web` – Next.js frontend
  - [x] Dev server: `pnpm dev`
  - [x] Build: `pnpm build`
  - [x] Start (prod): `pnpm start`
  - [x] Lint: `pnpm lint`
  - [x] Uses `@/sanity/*` for GROQ queries, live preview, and Visual Editing

- [x] `apps/tickets` – example Sanity UI app
  - [x] Dev server: `pnpm dev`
  - [x] Build: `pnpm build`
  - [x] Start (prod): `pnpm start`
  - [x] Uses `@sanity/sdk-react` + `@sanity/ui` to render `event` documents

## Root scripts

- [x] Install all dependencies: `pnpm install`
- [x] Run all dev servers in parallel: `pnpm dev`
- [x] Build all apps in parallel: `pnpm build`
- [x] Lint/format with Biome: `pnpm biome`

## Potential issues / things to check

- [ ] No `test` scripts defined in any `package.json` – add and document a test runner before relying on automated tests.
- [ ] `apps/tickets/src/App.tsx` uses a hard-coded Sanity `projectId`/`dataset` – consider moving to env vars for consistency.
- [ ] Studio and web env vars must be set correctly in local and deployment environments; misconfiguration will break content fetching and previews.
- [ ] `apps/web/src/sanity/lib/queries.ts` still contains legacy `PAGE_BUILDER_QUERY` for the old `page` type; clean up once fully migrated to `pageSite1`/`pageSite2`.
- [ ] Next.js 16 `cacheComponents` (see `apps/web/next.config.ts`) is experimental; watch for behavior changes on framework upgrades.
- [ ] Multi-site `sites` field injection in `apps/studio/schemaTypes/index.ts` enforces "single site unless crossSite" – verify this still matches editorial requirements when adding new document types.
