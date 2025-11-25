# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This is a `pnpm` monorepo containing Sanity Studio workspaces, a Next.js frontend, and a small Sanity SDK app:

- Root workspace: tooling and shared scripts.
- `apps/studio`: Sanity Studio with two workspaces (multi-site content authoring, schema, structure, presentation, migrations, and scripts).
- `apps/web`: Next.js 16 App Router frontend consuming Sanity content (events and page builder blocks) with live preview and draft mode.
- `apps/tickets`: Example React app using `@sanity/sdk-react` to render events with `@sanity/ui`.

Node >= 20 and pnpm >= 10 are required (see root `package.json` engines).

## Commands and workflows

### Install

From the repo root:

- Install all workspace dependencies:

  ```bash
  pnpm install
  ```

### Root scripts (multi-app)

From the repo root (`package.json`):

- Run all dev servers in parallel (Studio, Tickets app, Web frontend):

  ```bash
  pnpm dev
  ```

- Build all apps in parallel:

  ```bash
  pnpm build
  ```

- Run Biome (format/lint) across the repo, fixing issues in-place:

  ```bash
  pnpm biome
  ```

> Note: There is currently no `test` script defined at the root or in the apps. Before trying to run tests or a single test, first check for any newly added `test`/`vitest`/`jest` scripts in the relevant `package.json`.

### Next.js web app (`apps/web`)

From `apps/web`:

- Start the Next.js dev server (App Router, port 3000 by default):

  ```bash
  pnpm dev
  ```

- Build the Next.js app:

  ```bash
  pnpm build
  ```

- Start the production server (after `pnpm build`):

  ```bash
  pnpm start
  ```

- Run ESLint for the web app:

  ```bash
  pnpm lint
  ```

The web app is a standard `create-next-app` project; the primary entrypoints are under `apps/web/src/app` (e.g. `page.tsx`, `events/[slug]/page.tsx`, `[...slug]/page.tsx`).

### Sanity Studio (`apps/studio`)

From `apps/studio`:

- Start Sanity Studio dev server (multi-workspace, typically on port 3333):

  ```bash
  pnpm dev
  ```

  This runs the `predev` script first, which executes schema extraction and type generation with `--enforce-required-fields`.

- Build the Studio for production:

  ```bash
  pnpm build
  ```

  This also runs `prebuild` (schema extraction and typegen) before building.

- Deploy Studio:

  ```bash
  pnpm deploy
  ```

- Deploy GraphQL API for the configured project/dataset:

  ```bash
  pnpm deploy-graphql
  ```

- Manually regenerate Sanity schema/typegen artifacts (run this whenever you significantly change schemas or queries and want type updates without a dev/build):

  ```bash
  pnpm typegen
  ```

Environment for Studio is read from `apps/studio/lib/env.ts` and expects:

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_HOSTNAME`
- `SANITY_STUDIO_FRONTEND_HOST` (used for Presentation preview URLs)

### Tickets app (`apps/tickets`)

From `apps/tickets`:

- Start the Sanity app dev server:

  ```bash
  pnpm dev
  ```

- Build the app:

  ```bash
  pnpm build
  ```

- Start the app in production mode:

  ```bash
  pnpm start
  ```

This app is a small React UI built with `@sanity/sdk-react` and `@sanity/ui`, primarily useful as a reference for embedding Sanity-powered UIs.

### Running a single test

No test runner is currently configured in any `package.json`. If tests are added later, prefer to:

1. Add a `test` (and optionally `test:watch`) script to the app’s `package.json`.
2. Use the test runner’s standard CLI for running a single test (for example, `pnpm test -- path/to/file.test.ts` for Vitest/Jest, or a framework-specific pattern), and document it here.

## High-level architecture

### Monorepo layout and responsibilities

- **Root**
  - Manages the `pnpm` workspace (`pnpm-workspace.yaml` includes `apps/*`).
  - Provides aggregate scripts for `dev`, `build`, and `biome`.
- **`apps/studio`** – source of truth for content modeling and editorial workflows.
- **`apps/web`** – public-facing frontend consuming Sanity data (events and page builder pages).
- **`apps/tickets`** – example app using the new `@sanity/sdk-react` APIs to render events.

Changes to schemas or GROQ queries in `apps/studio` generally impact the types and queries used in `apps/web`.

### Sanity Studio (`apps/studio`)

**Multi-workspace configuration**

`apps/studio/sanity.config.ts` configures two workspaces using shared schema and plugins:

- Shared config (`sharedConfig`):
  - `projectId` and `dataset` from `lib/env.ts`.
  - `schema` from `schemaTypes/index.ts`.
- Shared plugins (`sharedPlugins`):
  - `visionTool()` (optionally others; `assist` is scaffolded but commented out).

Two concrete workspaces:

- `site-1` workspace:
  - Name and basePath derived from `lib/SITES.ts` (`/site-1`).
  - Uses `structureTool` with `structureSite1` for navigation.
  - Uses `presentationTool` with:
    - `resolve` from `presentation/resolve.ts` to map documents (e.g. `page`) to frontend URLs based on their slug.
    - `previewUrl.initial` pointing at `frontendHost` (Next.js host) and preview mode at `/api/draft-mode/enable`.
  - `tools` filter hides the Vision tool for non-admin users.

- `site-2` workspace:
  - Name and basePath `/site-2`.
  - Uses `structureTool` with `structureSite2` and `defaultDocumentNode`.
  - Also hides the Vision tool for non-admin users.

`lib/SITES.ts` defines `SITES` metadata for the two sites (name, title, URL), plus helpers `getSite` and `getSiteTitle`. These are used to derive workspace names, side navigation titles, and URLs consistently.

**Schema composition and multi-site field**

The central schema composition happens in `schemaTypes/index.ts`:

- Imports document types from `schemaTypes/documents` (e.g. `pageSite1`, `pageSite2`, `eventType`, `artistType`, `venueType`).
- Imports object types (including the page builder object) from `schemaTypes/objects`.
- Imports page builder block types from `schemaTypes/blocks` (`hero`, `gallery`, `reviews`, `organisers`).

Every document type is wrapped with an additional `sites` field:

- Implemented via mapping over `documents` and injecting a `defineField`:
  - `name: 'sites'`, `type: 'array'` of strings.
  - Grouped using `Group.sites` from `schemaTypes/utils/groups`.
  - Custom input component: `SiteNameInput` from `schemaTypes/components/SiteNameInput` for choosing which sites a document belongs to.
  - Validation:
    - If `documents.options.crossSite` is not enabled, ensures only one site is selected.
    - Ensures at least one site is always selected.

The final `schema` exported to Sanity is:

- `types: [...modifiedDocuments, ...objects, ...pageBuilderBlocks]`.

This means that:

- Multi-site behavior is enforced centrally for all document types.
- Page builder blocks (hero/gallery/reviews/organisers) are always available where the `pageBuilder` object is used.

**Studio structure and document views**

- `structure/structureSite1.ts`:
  - Uses a helper `documentTypeListItem` to build a structure tailored for site 1, focused on its `pageSite1` document type.
- `structure/structureSite2.ts`:
  - Builds a richer structure for site 2:
    - A `pageSite2` list.
    - Two lists for events: "Upcoming" (`date >= now()`) and "Past" (`date < now()`).
    - Lists for `artist` and `venue` document types.

- `structure/defaultDocumentNode.ts`:
  - For `artist` documents, adds a secondary document pane via `sanity-plugin-documents-pane` showing associated events (`*[_type == "event" && references($id)]`).
  - Other schema types fall back to the default form-only view.

**Presentation integration**

`presentation/resolve.ts` defines how documents map to frontend URLs for the Presentation tool:

- Defines a `page` location with `select` picking `title` and `slug.current`.
- `resolve` maps each document to a single `href` based on `/${doc.slug}`.

This directly corresponds to dynamic routes in the Next.js app (e.g. `[...slug]/page.tsx`).

**Scripts, migrations, and functions**

- `functions/` contains custom Sanity functions (e.g. `first-published`, `details-script`).
- `migrations/` contains migration scripts (e.g. `replace-event-type-with-event-format`).
- `scripts/` (e.g. `scripts/details.ts`) contains local CLIs to work with Sanity content.

When modifying data models or adding new document types, check for relevant migrations or scripts that may need updating.

### Next.js frontend (`apps/web`)

**Routing and pages**

The app uses the Next.js 16 App Router with routes in `apps/web/src/app`:

- `layout.tsx`:
  - Sets up shared layout, fonts (Geist), and global styles.
  - Uses `draftMode()` from `next/headers` to conditionally render:
    - `<SanityLive />` from `@/sanity/lib/live`.
    - `<VisualEditing />` from `next-sanity/visual-editing`.
    - `<DisableDraftMode />` (helper component to exit draft mode).

- `page.tsx` (root `/`):
  - Uses `sanityFetch` from `@/sanity/lib/live` with `HOMEPAGE_EVENTS_QUERY` to fetch upcoming events (where `date > now()`).
  - Uses `cacheLife` with a short `stale` time and `'use cache: private'` markers for fine-grained caching.
  - Renders a simple list of events linking to `/events/[slug]`.

- `events/[slug]/page.tsx`:
  - Wraps `EventPageParentCard` in `Suspense`, again with `cacheLife` to manage staleness.
  - `EventPageParentCard` handles fetching a single event and rendering details (check `apps/web/src/components/EventPageParentCard.tsx`).

- `[...slug]/page.tsx`:
  - Handles arbitrary slug segments for site 1 pages.
  - Uses `PAGE_QUERY_SITE_1` from `@/sanity/lib/queries` and `sanityFetch` to retrieve page data based on `slug.join('/')`.
  - Delegates rendering of page sections to the `PageBuilder` component.

**Sanity integration**

Key pieces live under `apps/web/src/sanity`:

- `env.ts`:
  - Reads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
- `lib/client.ts` (not shown above but referenced by `live.ts`):
  - Usual `next-sanity` client setup (check for project ID, dataset, API version, etc.).
- `lib/live.ts`:
  - Exports `sanityFetch` and `SanityLive` used for live-updating queries and Visual Editing.
- `lib/queries.ts`:
  - Defines key GROQ queries:
    - `HOMEPAGE_EVENTS_QUERY` for listing upcoming events.
    - `EVENT_QUERY` for event detail pages.
    - `PAGE_BUILDER_TYPES_ARRAY` and `PAGE_BUILDER_QUERY` (legacy `page` document type).
    - `PAGE_QUERY_SITE_1` and `PAGE_QUERY_SITE_2` for site-specific page types (`pageSite1`, `pageSite2`) including their `pageBuilder` blocks.

These queries mirror the structure of the Sanity schemas in `apps/studio/schemaTypes` and are the main contract between Studio and frontend.

**Page builder component mapping**

- `app/components/blocks/page-builder.tsx`:
  - Uses the generated type `PAGE_QUERY_SITE_1Result` from `@/sanity/types` (output of the Studio `typegen` script) to type the `content` prop.
  - Maps each block in `pageBuilder` by `_type`:
    - `'hero'` → `Hero` component.
    - `'reviews'` → `Review` component.
    - `'organisers'` → `Organisers` component.
    - `'gallery'` → `Gallery` component.
  - Falls back to a generic "Block not found" message for unknown types.

This mapping is tightly coupled to the block schema definitions in `apps/studio/schemaTypes/blocks`. When adding or renaming block types in Studio, you must:

1. Update the GROQ queries (e.g. `PAGE_QUERY_SITE_1` / `PAGE_QUERY_SITE_2`) to project the new block fields.
2. Extend `PageBuilder`’s switch statement to handle the new `_type`.
3. Re-run `pnpm typegen` in `apps/studio` so `@/sanity/types` stays in sync.

**Next.js configuration**

- `next.config.ts`:
  - Enables `cacheComponents` (experimental in Next 16).
  - Configures `images.remotePatterns` to allow images from `cdn.sanity.io` and `placehold.co`.

- `tsconfig.json`:
  - Sets `"paths": { "@/*": ["./src/*"] }` for absolute imports.
  - Includes `.next/types` for type-safe Next.js features.

### Tickets app (`apps/tickets`)

This app is a small example of consuming Sanity data using the new SDK and UI stack:

- `src/App.tsx`:
  - Defines a `SanityConfig[]` array (currently a single project/dataset) and passes it to `<SanityApp>` from `@sanity/sdk-react`.
  - Wraps the app in `SanityUI` (see below) and renders `<Events />`.
- `src/Events.tsx`:
  - Uses `useDocuments({ documentType: 'event' })` to stream `event` documents.
  - Renders each event using an `Event` component, wrapped in `Suspense` with a simple loading state.
- `src/SanityUI.tsx`:
  - Sets up `@sanity/ui` theming via `ThemeProvider` and `ToastProvider`.
  - Uses `styled-components` `createGlobalStyle` for minimal base styles.

This app is primarily useful as a reference for how to:

- Configure `SanityApp` with one or more Sanity projects.
- Use `useDocuments` to read document lists.
- Compose `@sanity/ui` primitives and theming.

## Notes for future changes

- When modifying Sanity schemas or adding blocks:
  - Update `apps/studio/schemaTypes` (documents/objects/blocks).
  - Update GROQ queries in `apps/web/src/sanity/lib/queries.ts`.
  - Re-run `pnpm typegen` in `apps/studio`.
  - Update `PageBuilder` and any other components depending on the new schema.
- When adjusting multi-site behavior:
  - Keep `lib/SITES.ts`, the `sites` field injection in `schemaTypes/index.ts`, and structure-resolver files in sync.
  - Verify Presentation preview URLs (`presentation/resolve.ts` and Next.js routes) still point at valid frontend paths.
