# CLAUDE.md

**AI Assistant Guide for Day One Content Operations**

This file provides comprehensive guidance for AI assistants (like Claude Code) working with this codebase. It's optimized for both AI understanding and human reference.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Architecture](#architecture)
- [Code Organization](#code-organization)
- [Key Concepts](#key-concepts)
- [Environment Variables](#environment-variables)
- [Common Tasks](#common-tasks)
- [Data Flow](#data-flow)
- [Component Mapping](#component-mapping)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)
- [Deployment](#deployment)
- [References](#references)

---

## Project Overview

**Name**: Day One Content Operations
**Type**: pnpm workspace monorepo
**Purpose**: Multi-site content management system built for learning Sanity.io

This project demonstrates enterprise-grade CMS architecture with:
- **Multi-workspace Sanity Studio** for content authoring across multiple sites
- **Next.js 16 frontend** with App Router, live preview, and visual editing
- **Example SDK app** showcasing modern Sanity SDK usage

**Primary Use Cases**:
1. Content editors manage events, artists, venues, and pages across multiple sites
2. Frontend displays dynamic content with page builder flexibility
3. Demonstrates Sanity best practices for certification/learning

---

## Monorepo Structure

```
day-one/
├── apps/
│   ├── studio/          # Sanity Studio (multi-workspace CMS)
│   ├── web/             # Next.js 16 frontend (App Router)
│   └── tickets/         # Example Sanity SDK React app
├── node_modules/        # Hoisted pnpm dependencies
├── .git/                # Git repository
├── .vscode/             # VS Code settings (Biome formatter)
├── .idea/               # JetBrains IDE settings
├── package.json         # Root workspace configuration
├── pnpm-workspace.yaml  # Workspace definitions (apps/*)
├── pnpm-lock.yaml       # Dependency lock file (14,812 lines)
├── biome.json           # Biome formatter/linter config
├── README.md            # Human-readable project documentation
├── WARP.md              # WARP CLI assistant documentation
├── CLAUDE.md            # This file (AI assistant guide)
└── .gitignore           # Git ignore patterns
```

### Workspace Dependencies

- **Root** → Manages all workspaces, provides parallel dev/build scripts
- **Studio** → Generates types consumed by Web
- **Web** → Depends on Studio's generated types (`apps/web/src/sanity/types.ts`)
- **Tickets** → Independent, no inter-workspace dependencies

---

## Tech Stack

### Core Technologies

| Technology | Version | Purpose | Location |
|------------|---------|---------|----------|
| **Node.js** | >= 20.0.0 | Runtime | All apps |
| **pnpm** | >= 10.0.0 | Package manager | Root |
| **TypeScript** | 5.9.3 | Language | All apps |
| **React** | 19.2.0 | UI framework | All apps |

### Sanity Stack (Studio)

| Package | Version | Purpose |
|---------|---------|---------|
| **sanity** | 4.15.0 | CMS platform |
| **@sanity/vision** | 4.15.0 | GROQ query playground |
| **@sanity/ui** | 2.16.22 | UI component library |
| **@sanity/client** | 7.12.x | JavaScript client |
| **@sanity/functions** | 4.15.0 | Serverless functions |
| **styled-components** | 6.1.19 | CSS-in-JS styling |

### Next.js Stack (Web)

| Package | Version | Purpose |
|---------|---------|---------|
| **next** | 16.0.0 | React framework |
| **next-sanity** | 11.6.2 | Sanity integration |
| **@sanity/image-url** | Latest | Image URL builder |
| **tailwindcss** | 4.x | Utility-first CSS |
| **@portabletext/editor** | Latest | Rich text editing |

### SDK Stack (Tickets)

| Package | Version | Purpose |
|---------|---------|---------|
| **@sanity/sdk** | 2.3.1 | New Sanity SDK |
| **@sanity/sdk-react** | 2.3.1 | React hooks |
| **@sanity/ui** | 2.16.22 | UI components |

### Development Tools

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Biome** 2.3.6 | Fast formatter/linter | `biome.json` |
| **ESLint** 9 | Linting (web only) | `apps/web/.eslintrc.json` |
| **Prettier** 3.6.2 | Formatting (studio) | `apps/studio/.prettierrc` |

**Why Biome?** Replaces ESLint + Prettier for 10-100x faster performance, simpler configuration, and unified tooling.

---

## Getting Started

### Prerequisites

```bash
# Check Node.js version (must be >= 20)
node --version

# Check pnpm version (must be >= 10)
pnpm --version

# Install pnpm if missing
npm install -g pnpm@latest
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd day-one

# Install all dependencies (hoisted to root node_modules)
pnpm install
```

### Environment Variables

Create `.env.local` files in each app:

**apps/studio/.env.local**:
```bash
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_HOSTNAME=https://your-studio.sanity.studio
SANITY_STUDIO_FRONTEND_HOST=http://localhost:3000
```

**apps/web/.env.local**:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token
SANITY_STUDIO_URL=http://localhost:3334
SANITY_REVALIDATE_SECRET=your_webhook_secret
```

### First Run

```bash
# Start all dev servers in parallel
pnpm dev

# This starts:
# - Studio at http://localhost:3334
# - Web at http://localhost:3000
# - Tickets at http://localhost:5173 (or similar)
```

---

## Development Workflow

### Root Commands (Run from `/`)

```bash
# Install dependencies
pnpm install

# Start all dev servers
pnpm dev

# Build all apps for production
pnpm build

# Format and lint entire codebase
pnpm biome
```

### Studio Commands (Run from `apps/studio/`)

```bash
# Start Studio dev server (port 3334)
pnpm dev

# Build for production
pnpm build

# Deploy Studio
pnpm deploy

# Deploy GraphQL API
pnpm deploy-graphql

# Regenerate TypeScript types (manual)
pnpm typegen
```

**Important**: Studio runs `predev` and `prebuild` hooks that automatically:
1. Extract schema to `schema.json`
2. Generate TypeScript types for Web app

### Web Commands (Run from `apps/web/`)

```bash
# Start Next.js dev server (port 3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

### Tickets Commands (Run from `apps/tickets/`)

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Content Editors                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Sanity Studio (Port 3334)              │
│  ┌─────────────┐              ┌─────────────┐      │
│  │  Site 1     │              │  Site 2     │      │
│  │  Workspace  │              │  Workspace  │      │
│  └─────────────┘              └─────────────┘      │
│                                                      │
│  Multi-site content: Events, Artists, Venues, Pages │
└────────────────┬────────────────────────────────────┘
                 │
                 │ (1) Schema + Type Generation
                 │ (2) GROQ Queries
                 │ (3) Webhooks (Revalidation)
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│            Next.js 16 Web (Port 3000)               │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  App Router                                 │   │
│  │  - Homepage (Event List)                    │   │
│  │  - /events/[slug] (Event Detail)            │   │
│  │  - /[...slug] (Page Builder Pages)          │   │
│  │  - /api/draft-mode/enable (Preview)         │   │
│  │  - /api/revalidate-path (Webhook)           │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  Features: Live Preview, Visual Editing, ISR        │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│                   End Users                         │
└─────────────────────────────────────────────────────┘
```

### Multi-Workspace Studio Architecture

**File**: `apps/studio/sanity.config.ts`

Studio uses a shared configuration pattern:

```typescript
// Shared config
const sharedConfig = {
  projectId: env.projectId,
  dataset: env.dataset,
  schema: { types: schemaTypes }
}

// Shared plugins
const sharedPlugins = [
  visionTool(),
  // assist() - scaffolded but commented out
]

// Two workspaces
export default defineConfig([
  {
    ...sharedConfig,
    name: SITES[0].name,        // 'site-1'
    basePath: `/${SITES[0].name}`,
    plugins: [
      ...sharedPlugins,
      structureTool({ structure: structureSite1 }),
      presentationTool({ resolve, previewUrl: {...} })
    ]
  },
  {
    ...sharedConfig,
    name: SITES[1].name,        // 'site-2'
    basePath: `/${SITES[1].name}`,
    plugins: [
      ...sharedPlugins,
      structureTool({
        structure: structureSite2,
        defaultDocumentNode
      })
    ]
  }
])
```

**Key Points**:
- Both workspaces share the same schema and project/dataset
- Each workspace has custom structure and tools
- Site 1: Focused on page builder with presentation preview
- Site 2: Event-centric with temporal filtering

---

## Code Organization

### Studio App (`apps/studio/`)

```
apps/studio/
├── schemaTypes/              # Content model definitions
│   ├── documents/           # Top-level document types
│   │   ├── event.ts        # Event document (artists, venue, dates)
│   │   ├── artist.ts       # Artist document
│   │   ├── venue.ts        # Venue document
│   │   ├── pageSite1.ts    # Site 1 page with page builder
│   │   └── pageSite2.ts    # Site 2 page with page builder
│   ├── blocks/              # Page builder block definitions
│   │   ├── hero.ts         # Hero section block
│   │   ├── gallery.ts      # Gallery block
│   │   ├── reviews.ts      # Reviews block
│   │   └── organisers.ts   # Organisers block
│   ├── objects/             # Reusable object schemas
│   │   └── pageBuilder.ts  # Page builder array type
│   ├── components/          # Custom input components
│   │   ├── DoorsOpenInput.tsx   # Calculates door time
│   │   └── SiteNameInput.tsx    # Multi-site checkbox UI
│   ├── utils/               # Schema utilities
│   │   └── groups.ts       # Field grouping definitions
│   └── index.ts            # Schema composition + site injection
├── structure/               # Studio structure customization
│   ├── structureSite1.ts   # Site 1 navigation
│   ├── structureSite2.ts   # Site 2 navigation (event filters)
│   ├── defaultDocumentNode.ts  # Custom document views
│   └── utils/              # Structure helpers
├── presentation/            # Presentation tool config
│   └── resolve.ts          # Document → URL mapping
├── functions/               # Sanity serverless functions
│   ├── first-published/    # Auto-set first publish date
│   │   └── index.ts
│   └── details-script/     # AI-generated event descriptions
│       └── index.ts
├── migrations/              # Schema migration scripts
│   └── replace-event-type-with-event-format/
│       └── index.ts
├── lib/                     # Shared utilities
│   ├── env.ts              # Environment variable loading
│   └── SITES.ts            # Multi-site configuration
├── custom-utils/            # Custom utility functions
├── static/                  # Static assets
├── .sanity/                 # Sanity runtime config
│   ├── blueprint.config.json
│   └── runtime/
├── dist/                    # Built Studio files
├── sanity.config.ts         # Main configuration
├── sanity.cli.ts            # CLI configuration
├── sanity.blueprint.ts      # Functions blueprint
├── sanity-typegen.json      # Type generation config
└── schema.json              # Extracted schema (62KB)
```

**Key Files**:
- `schemaTypes/index.ts:1` - Schema composition with automatic `sites` field injection
- `sanity.config.ts:1` - Multi-workspace configuration
- `lib/SITES.ts:1` - Single source of truth for site metadata
- `sanity-typegen.json:1` - Configures type generation for Web app

### Web App (`apps/web/`)

```
apps/web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout (fonts, draft mode)
│   │   ├── page.tsx        # Homepage (event list)
│   │   ├── [...slug]/      # Dynamic page builder pages
│   │   │   └── page.tsx
│   │   ├── events/[slug]/  # Event detail pages
│   │   │   └── page.tsx
│   │   ├── api/            # API routes
│   │   │   ├── draft-mode/enable/  # Enable preview
│   │   │   │   └── route.ts
│   │   │   └── revalidate-path/    # Webhook endpoint
│   │   │       └── route.ts
│   │   ├── components/blocks/  # Page builder renderers
│   │   │   ├── page-builder.tsx   # Main mapper
│   │   │   ├── hero.tsx
│   │   │   ├── gallery.tsx
│   │   │   ├── review.tsx
│   │   │   └── organisers.tsx
│   │   ├── actions.ts      # Server actions (disable draft)
│   │   └── globals.css     # Global styles
│   ├── components/         # Shared React components
│   │   ├── EventPageParentCard.tsx
│   │   └── DisableDraftMode.tsx
│   ├── sanity/             # Sanity integration layer
│   │   ├── lib/
│   │   │   ├── client.ts   # Sanity client config
│   │   │   ├── live.ts     # Live queries + sanityFetch
│   │   │   ├── queries.ts  # GROQ query definitions
│   │   │   └── image.ts    # Image URL helpers
│   │   ├── types.ts        # Generated from Studio
│   │   └── env.ts          # Environment config
│   ├── lib/                # Utility functions
│   │   └── image.ts
│   └── types.ts            # Custom type definitions
├── .next/                  # Next.js build output (gitignored)
├── public/                 # Static assets
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # PostCSS + Tailwind
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript config
```

**Key Files**:
- `src/sanity/lib/queries.ts:1` - All GROQ queries
- `src/sanity/lib/live.ts:1` - `sanityFetch` function for draft mode
- `src/sanity/types.ts:1` - Generated types (DO NOT EDIT)
- `src/app/components/blocks/page-builder.tsx:1` - Block type mapper
- `src/app/api/draft-mode/enable/route.ts:1` - Preview mode activation
- `src/app/api/revalidate-path/route.ts:1` - Webhook handler

### Tickets App (`apps/tickets/`)

```
apps/tickets/
├── src/
│   ├── App.tsx             # Main app with SanityApp provider
│   ├── Events.tsx          # Event list using useDocuments
│   ├── Event.tsx           # Single event component
│   ├── SanityUI.tsx        # Theme provider
│   ├── Publish.tsx         # Publish component
│   ├── TicketURL.tsx       # Ticket URL component
│   └── ExampleComponent.tsx
└── package.json
```

---

## Key Concepts

### 1. Multi-Site Content Management

**Implementation**: `apps/studio/schemaTypes/index.ts:10-25`

Every document type automatically gets a `sites` field:

```typescript
const modifiedDocuments = documents.map((doc) => ({
  ...doc,
  fields: [
    defineField({
      name: 'sites',
      type: 'array',
      of: [{ type: 'string' }],
      components: { input: SiteNameInput },
      validation: (rule) => {
        if (!doc.options?.crossSite) {
          return rule.required().max(1).error(
            'Please select exactly one site (or enable crossSite)'
          )
        }
        return rule.required().min(1)
      }
    }),
    ...(doc.fields || [])
  ]
}))
```

**Key Points**:
- `sites` field is an array of strings (`['site-1']` or `['site-2']`)
- By default, documents must belong to exactly ONE site
- Set `options: { crossSite: true }` to allow multi-site content
- Custom `SiteNameInput` component provides checkbox UI
- Validation ensures content is always assigned to at least one site

### 2. Page Builder System

**Block Definitions**: `apps/studio/schemaTypes/blocks/`
**Block Rendering**: `apps/web/src/app/components/blocks/page-builder.tsx:1`

The page builder uses a type-driven component mapping:

```typescript
// Block type mapper
{content?.pageBuilder?.map((block) => {
  switch (block._type) {
    case 'hero':
      return <Hero key={block._key} {...block} />
    case 'gallery':
      return <Gallery key={block._key} {...block} />
    case 'reviews':
      return <Review key={block._key} {...block} />
    case 'organisers':
      return <Organisers key={block._key} {...block} />
    default:
      return <div key={block._key}>Block type not found</div>
  }
})}
```

**Adding New Blocks**:
1. Create schema in `apps/studio/schemaTypes/blocks/newBlock.ts`
2. Export from `apps/studio/schemaTypes/index.ts`
3. Update GROQ query in `apps/web/src/sanity/lib/queries.ts` to project fields
4. Run `pnpm typegen` in Studio
5. Create React component in `apps/web/src/app/components/blocks/newBlock.tsx`
6. Add case to page-builder.tsx switch statement

### 3. Type Generation Flow

**Configuration**: `apps/studio/sanity-typegen.json`

```json
{
  "path": "../web/src/sanity/types.ts",
  "generates": "all",
  "target": "typescript",
  "schemas": "./schema.json",
  "overload": true,
  "paths": {
    "source": [
      "../web/src/**/*.{ts,tsx,js,jsx}"
    ]
  }
}
```

**Flow**:
```
1. Studio Schemas (schemaTypes/)
   → sanity schema extract
   → schema.json

2. Web Queries (lib/queries.ts) + schema.json
   → sanity typegen generate
   → types.ts (with GROQ result types)

3. Web Components
   → Import types from @/sanity/types
   → Type-safe rendering
```

**Automatic Generation**: The `predev` and `prebuild` scripts in Studio ensure types are always fresh.

### 4. Live Preview & Draft Mode

**Draft Mode Activation**: `apps/web/src/app/api/draft-mode/enable/route.ts:1`

```typescript
import { defineEnableDraftMode } from 'next-sanity/draft-mode'

export const { GET } = defineEnableDraftMode({
  client: readClient.withConfig({ token: readToken })
})
```

**Usage in Components**: `apps/web/src/sanity/lib/live.ts:1`

```typescript
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: readToken
})

// In components:
const events = await sanityFetch({
  query: HOMEPAGE_EVENTS_QUERY,
  perspective: draftMode().isEnabled ? 'previewDrafts' : 'published'
})
```

**How It Works**:
1. Editor clicks "Open Preview" in Studio
2. Studio navigates to `/api/draft-mode/enable?slug=/events/my-event`
3. Next.js sets draft mode cookie
4. `sanityFetch` uses `previewDrafts` perspective (includes drafts)
5. Visual Editing overlay loads for in-context editing
6. User clicks "Exit Draft Mode" to return to published view

### 5. Caching Strategy (Next.js 16)

**File**: `apps/web/src/app/page.tsx:15`

```typescript
'use cache: private'

export default async function Home() {
  cacheLife({ stale: 60, revalidate: 300 }) // 1 min stale, 5 min revalidate

  const events = await sanityFetch({
    query: HOMEPAGE_EVENTS_QUERY
  })
  // ...
}
```

**Cache Invalidation**: `apps/web/src/app/api/revalidate-path/route.ts:1`

Sanity webhooks trigger `revalidatePath()` to clear Next.js cache on content publish.

### 6. Structure Customization

**Site 2 Example**: `apps/studio/structure/structureSite2.ts:1`

```typescript
export const structureSite2 = (S) =>
  S.list()
    .title('Site 2')
    .items([
      documentTypeListItem({ S, schemaType: 'pageSite2' }),
      S.divider(),
      S.listItem()
        .title('Upcoming Events')
        .child(
          S.documentList()
            .title('Upcoming')
            .filter('_type == "event" && date >= now()')
            .defaultOrdering([{ field: 'date', direction: 'asc' }])
        ),
      S.listItem()
        .title('Past Events')
        .child(
          S.documentList()
            .title('Past')
            .filter('_type == "event" && date < now()')
            .defaultOrdering([{ field: 'date', direction: 'desc' }])
        ),
      S.divider(),
      documentTypeListItem({ S, schemaType: 'artist' }),
      documentTypeListItem({ S, schemaType: 'venue' })
    ])
```

**Custom Document Views**: `apps/studio/structure/defaultDocumentNode.ts:1`

Artists get a related events pane using `sanity-plugin-documents-pane`.

---

## Environment Variables

### Required Variables

#### Studio (`apps/studio/.env.local`)

| Variable | Example | Purpose |
|----------|---------|---------|
| `SANITY_STUDIO_PROJECT_ID` | `abc123xyz` | Sanity project ID |
| `SANITY_STUDIO_DATASET` | `production` | Dataset name |
| `SANITY_STUDIO_HOSTNAME` | `https://my-studio.sanity.studio` | Studio URL |
| `SANITY_STUDIO_FRONTEND_HOST` | `http://localhost:3000` | Next.js preview URL |

**Usage**: `apps/studio/lib/env.ts:1`

#### Web (`apps/web/.env.local`)

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `abc123xyz` | Sanity project ID (public) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Dataset name (public) |
| `SANITY_API_READ_TOKEN` | `sk...` | Read token for drafts |
| `SANITY_STUDIO_URL` | `http://localhost:3334` | Studio URL for stega |
| `SANITY_REVALIDATE_SECRET` | `random_string` | Webhook signature secret |

**Usage**: `apps/web/src/sanity/env.ts:1`

### Variable Validation

Both apps validate environment variables at startup:

```typescript
// apps/studio/lib/env.ts
if (!process.env.SANITY_STUDIO_PROJECT_ID) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID')
}
```

**Critical**: Studio and Web must use matching `PROJECT_ID` and `DATASET` values.

---

## Common Tasks

### Task 1: Add a New Document Type

**Steps**:

1. **Create schema** in `apps/studio/schemaTypes/documents/newType.ts`:
   ```typescript
   import { defineType, defineField } from 'sanity'

   export const newTypeType = defineType({
     name: 'newType',
     title: 'New Type',
     type: 'document',
     fields: [
       defineField({
         name: 'title',
         type: 'string',
         validation: (rule) => rule.required()
       })
     ]
   })
   ```

2. **Export** from `apps/studio/schemaTypes/index.ts`:
   ```typescript
   import { newTypeType } from './documents/newType'

   const documents = [
     // ...existing types
     newTypeType
   ]
   ```

3. **Update structure** if needed (`apps/studio/structure/structureSite1.ts`):
   ```typescript
   documentTypeListItem({ S, schemaType: 'newType' })
   ```

4. **Regenerate types**:
   ```bash
   cd apps/studio
   pnpm typegen
   ```

The `sites` field is automatically injected by the schema composition logic.

### Task 2: Add a New Page Builder Block

**Steps**:

1. **Create block schema** in `apps/studio/schemaTypes/blocks/newBlock.ts`:
   ```typescript
   import { defineType, defineField } from 'sanity'

   export const newBlock = defineType({
     name: 'newBlock',
     title: 'New Block',
     type: 'object',
     fields: [
       defineField({
         name: 'title',
         type: 'string'
       })
     ]
   })
   ```

2. **Export** from `apps/studio/schemaTypes/index.ts`:
   ```typescript
   import { newBlock } from './blocks/newBlock'

   const pageBuilderBlocks = [
     // ...existing blocks
     newBlock
   ]
   ```

3. **Update GROQ query** in `apps/web/src/sanity/lib/queries.ts`:
   ```typescript
   const PAGE_QUERY_SITE_1 = groq`
     *[_type == "pageSite1" && slug.current == $slug][0] {
       ...,
       pageBuilder[] {
         ...,
         _type == "newBlock" => {
           title
         }
       }
     }
   `
   ```

4. **Regenerate types**:
   ```bash
   cd apps/studio
   pnpm typegen
   ```

5. **Create React component** in `apps/web/src/app/components/blocks/newBlock.tsx`:
   ```typescript
   import type { PAGE_QUERY_SITE_1Result } from '@/sanity/types'

   type NewBlockProps = Extract<
     NonNullable<PAGE_QUERY_SITE_1Result['pageBuilder']>[number],
     { _type: 'newBlock' }
   >

   export function NewBlock({ title }: NewBlockProps) {
     return <div>{title}</div>
   }
   ```

6. **Add to page-builder mapper** in `apps/web/src/app/components/blocks/page-builder.tsx`:
   ```typescript
   import { NewBlock } from './newBlock'

   case 'newBlock':
     return <NewBlock key={block._key} {...block} />
   ```

### Task 3: Query Content from Web App

**Steps**:

1. **Define GROQ query** in `apps/web/src/sanity/lib/queries.ts`:
   ```typescript
   export const MY_QUERY = groq`
     *[_type == "event" && defined(slug.current)] {
       _id,
       title,
       slug,
       date
     }
   `
   ```

2. **Use in component**:
   ```typescript
   import { sanityFetch } from '@/sanity/lib/live'
   import { MY_QUERY } from '@/sanity/lib/queries'
   import type { MY_QUERYResult } from '@/sanity/types'

   export default async function MyPage() {
     const events = await sanityFetch<MY_QUERYResult>({
       query: MY_QUERY
     })

     return <div>{/* render events */}</div>
   }
   ```

3. **Regenerate types** if query changed:
   ```bash
   cd apps/studio
   pnpm typegen
   ```

### Task 4: Add Environment Variable

**Steps**:

1. **Add to `.env.local`**:
   ```bash
   # apps/studio/.env.local or apps/web/.env.local
   MY_NEW_VAR=value
   ```

2. **Add validation** in `lib/env.ts` or `sanity/env.ts`:
   ```typescript
   if (!process.env.MY_NEW_VAR) {
     throw new Error('Missing MY_NEW_VAR')
   }

   export const myNewVar = process.env.MY_NEW_VAR
   ```

3. **Use in code**:
   ```typescript
   import { myNewVar } from '@/lib/env'
   ```

### Task 5: Deploy Studio

**Steps**:

1. **Set production env vars** (in Sanity dashboard or CI/CD):
   ```bash
   SANITY_STUDIO_PROJECT_ID=abc123xyz
   SANITY_STUDIO_DATASET=production
   SANITY_STUDIO_HOSTNAME=https://my-studio.sanity.studio
   SANITY_STUDIO_FRONTEND_HOST=https://my-site.com
   ```

2. **Deploy**:
   ```bash
   cd apps/studio
   pnpm deploy
   ```

3. **Deploy GraphQL API** (if needed):
   ```bash
   pnpm deploy-graphql
   ```

### Task 6: Set Up Webhook for Revalidation

**Steps**:

1. **Configure webhook in Sanity dashboard**:
   - URL: `https://your-site.com/api/revalidate-path`
   - HTTP method: POST
   - Dataset: production
   - Trigger on: Create/Update/Delete
   - Projection: `{"path": slug.current}`
   - Secret: Same as `SANITY_REVALIDATE_SECRET`

2. **Webhook handler** is already implemented in `apps/web/src/app/api/revalidate-path/route.ts:1`

---

## Data Flow

### Content Creation Flow

```
1. Editor creates/edits content in Studio
   ↓
2. Content saved to Sanity dataset
   ↓
3. Webhook fires → /api/revalidate-path
   ↓
4. Next.js revalidates affected paths
   ↓
5. Next page request fetches fresh data
```

### Type Generation Flow

```
1. Define schemas in apps/studio/schemaTypes/
   ↓
2. Run: sanity schema extract → schema.json
   ↓
3. Run: sanity typegen generate
   ↓
4. Scans Web queries in src/sanity/lib/queries.ts
   ↓
5. Generates result types in src/sanity/types.ts
   ↓
6. Import types in Web components
```

### Preview Flow

```
1. Editor clicks "Open Preview" in Studio
   ↓
2. Studio navigates to /api/draft-mode/enable?slug=...
   ↓
3. Next.js enables draft mode (cookie)
   ↓
4. Component checks draftMode().isEnabled
   ↓
5. sanityFetch uses 'previewDrafts' perspective
   ↓
6. Draft content rendered with Visual Editing overlay
   ↓
7. Editor makes changes in overlay → auto-saved to Sanity
   ↓
8. Click "Exit Draft Mode" to return to published view
```

### Multi-Site Flow

```
1. Editor selects sites via SiteNameInput (checkboxes)
   ↓
2. sites field saved as array: ['site-1'] or ['site-2']
   ↓
3. Structure resolvers filter by site (optional)
   ↓
4. Frontend queries can filter: *[_type == "page" && "site-1" in sites]
   ↓
5. Content displayed on correct site(s)
```

---

## Component Mapping

### Page Builder Blocks

| Schema Type | File | React Component | Purpose |
|-------------|------|-----------------|---------|
| `hero` | `apps/studio/schemaTypes/blocks/hero.ts:1` | `apps/web/src/app/components/blocks/hero.tsx:1` | Hero section with title, text, image |
| `gallery` | `apps/studio/schemaTypes/blocks/gallery.ts:1` | `apps/web/src/app/components/blocks/gallery.tsx:1` | Image gallery with titles |
| `reviews` | `apps/studio/schemaTypes/blocks/reviews.ts:1` | `apps/web/src/app/components/blocks/review.tsx:1` | Review section with rich text |
| `organisers` | `apps/studio/schemaTypes/blocks/organisers.ts:1` | `apps/web/src/app/components/blocks/organisers.tsx:1` | Organizer section |

### Document Types

| Schema Type | File | Purpose |
|-------------|------|---------|
| `pageSite1` | `apps/studio/schemaTypes/documents/pageSite1.ts:1` | Site 1 page with page builder |
| `pageSite2` | `apps/studio/schemaTypes/documents/pageSite2.ts:1` | Site 2 page with page builder |
| `event` | `apps/studio/schemaTypes/documents/event.ts:1` | Event with artists, venue, dates |
| `artist` | `apps/studio/schemaTypes/documents/artist.ts:1` | Artist profile |
| `venue` | `apps/studio/schemaTypes/documents/venue.ts:1` | Venue information |

### Routes

| Path | File | Purpose |
|------|------|---------|
| `/` | `apps/web/src/app/page.tsx:1` | Homepage (event list) |
| `/events/[slug]` | `apps/web/src/app/events/[slug]/page.tsx:1` | Event detail page |
| `/[...slug]` | `apps/web/src/app/[...slug]/page.tsx:1` | Dynamic page builder pages |
| `/api/draft-mode/enable` | `apps/web/src/app/api/draft-mode/enable/route.ts:1` | Enable preview mode |
| `/api/revalidate-path` | `apps/web/src/app/api/revalidate-path/route.ts:1` | Webhook for cache invalidation |

---

## Troubleshooting

### Common Issues

#### Issue 1: Type errors in Web app after schema changes

**Symptoms**: TypeScript errors like `Property 'newField' does not exist on type...`

**Solution**:
```bash
cd apps/studio
pnpm typegen
```

**Why**: Web app uses generated types from Studio. Schema changes require regeneration.

#### Issue 2: Preview mode not working

**Symptoms**: Changes in Studio don't appear in preview

**Checklist**:
- [ ] `SANITY_API_READ_TOKEN` is set in `apps/web/.env.local`
- [ ] Token has read permissions in Sanity project settings
- [ ] `SANITY_STUDIO_FRONTEND_HOST` in Studio matches Web URL
- [ ] `SANITY_STUDIO_URL` in Web matches Studio URL
- [ ] Both apps use same `PROJECT_ID` and `DATASET`

**Debug**:
```bash
# Check draft mode status
# Visit: http://localhost:3000
# Should see "Exit Draft Mode" button if enabled
```

#### Issue 3: Webhook not triggering revalidation

**Symptoms**: Content updates don't appear on frontend

**Checklist**:
- [ ] Webhook URL is correct: `https://your-site.com/api/revalidate-path`
- [ ] Webhook secret matches `SANITY_REVALIDATE_SECRET`
- [ ] Webhook projection includes `path` field: `{"path": slug.current}`
- [ ] Check Sanity webhook logs for errors

**Debug**:
```typescript
// Add logging to apps/web/src/app/api/revalidate-path/route.ts
console.log('Webhook received:', body)
```

#### Issue 4: pnpm install fails

**Symptoms**: Dependency resolution errors

**Solutions**:
```bash
# Clear pnpm cache
pnpm store prune

# Delete node_modules and lockfile
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install
```

#### Issue 5: Port already in use

**Symptoms**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 pnpm dev
```

#### Issue 6: Multi-site field validation errors

**Symptoms**: "Please select exactly one site" error when saving

**Cause**: Document type doesn't have `crossSite: true` option

**Solution**:
```typescript
// In schema definition
export const myType = defineType({
  name: 'myType',
  type: 'document',
  options: {
    crossSite: true  // Allow multi-site content
  },
  fields: [...]
})
```

### Known Issues (from README.md)

1. **No test scripts configured** - Add testing framework before production
2. **Tickets app uses hardcoded projectId** - Should use env vars for consistency
3. **Studio/Web env vars must match** - Misconfiguration breaks content fetching
4. **Legacy PAGE_BUILDER_QUERY exists** - Clean up after full migration
5. **Next.js 16 cacheComponents is experimental** - Monitor for breaking changes
6. **Multi-site enforcement** - Verify "single site unless crossSite" matches requirements

---

## Testing

### Current State

**No test runner is currently configured.**

From `README.md:51`:
> No `test` scripts defined in any `package.json` – add and document a test runner before relying on automated tests.

### Recommended Setup (Future)

**For Studio**:
- **Framework**: Vitest (fast, modern)
- **Focus**: Schema validation, structure logic, custom components

**For Web**:
- **Framework**: Vitest + Testing Library
- **Focus**: Component rendering, data fetching, page builder logic

**For Tickets**:
- **Framework**: Vitest + Testing Library
- **Focus**: SDK integration, UI components

### Adding Tests

1. **Install test dependencies**:
   ```bash
   cd apps/web
   pnpm add -D vitest @testing-library/react @testing-library/jest-dom
   ```

2. **Add test script** to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:watch": "vitest --watch"
     }
   }
   ```

3. **Create test file**:
   ```typescript
   // apps/web/src/app/components/blocks/hero.test.tsx
   import { render, screen } from '@testing-library/react'
   import { Hero } from './hero'

   test('renders hero title', () => {
     render(<Hero title="Hello" text="World" />)
     expect(screen.getByText('Hello')).toBeInTheDocument()
   })
   ```

---

## Deployment

### Studio Deployment

**Target**: Sanity-hosted Studio at `https://your-project.sanity.studio`

**Steps**:

1. **Set production environment variables** in Sanity dashboard or deployment platform

2. **Deploy**:
   ```bash
   cd apps/studio
   pnpm deploy
   ```

3. **Deploy GraphQL API** (if using):
   ```bash
   pnpm deploy-graphql
   ```

**Configuration**: `apps/studio/sanity.cli.ts:1`

### Web App Deployment

**Recommended**: Vercel (optimized for Next.js)

**Steps**:

1. **Connect repository** to Vercel

2. **Configure build settings**:
   - Build command: `cd apps/web && pnpm build`
   - Output directory: `apps/web/.next`
   - Install command: `pnpm install`

3. **Set environment variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=sk...
   SANITY_STUDIO_URL=https://your-project.sanity.studio
   SANITY_REVALIDATE_SECRET=random_string
   ```

4. **Deploy**:
   ```bash
   git push origin main
   # Vercel auto-deploys on push
   ```

**Alternative Platforms**: Netlify, Cloudflare Pages, AWS Amplify, self-hosted Node.js

### Tickets App Deployment

**Recommended**: Vercel, Netlify, or Cloudflare Pages

**Note**: This is an example app, typically not deployed to production.

---

## References

### Official Documentation

- **Sanity**: https://www.sanity.io/docs
- **Next.js**: https://nextjs.org/docs
- **Sanity + Next.js**: https://www.sanity.io/docs/nextjs
- **GROQ**: https://www.sanity.io/docs/groq
- **Sanity SDK**: https://www.sanity.io/docs/js-client
- **Visual Editing**: https://www.sanity.io/docs/visual-editing

### Key Guides

- **Multi-workspace Studio**: https://www.sanity.io/docs/workspaces
- **Presentation Tool**: https://www.sanity.io/docs/presentation
- **Draft Mode (Next.js)**: https://nextjs.org/docs/app/building-your-application/configuring/draft-mode
- **next-sanity**: https://github.com/sanity-io/next-sanity
- **Sanity Functions**: https://www.sanity.io/docs/functions

### Project-Specific Files

- `README.md` - Human-readable project overview
- `WARP.md` - WARP CLI assistant documentation
- `apps/studio/sanity.config.ts:1` - Studio configuration
- `apps/web/next.config.ts:1` - Next.js configuration
- `biome.json:1` - Code quality configuration

### Sanity Learning

This project was built following: https://www.sanity.io/learn

---

## Best Practices for AI Assistants

### When Working with This Codebase

1. **Always read before editing**: Use Read tool on files before making changes
2. **Regenerate types after schema changes**: Run `pnpm typegen` in Studio
3. **Respect multi-site architecture**: Don't bypass `sites` field injection
4. **Follow data flow**: Schema → Query → Type → Component
5. **Use parallel tool calls**: Read multiple files simultaneously when gathering context
6. **Check environment variables**: Ensure Studio and Web vars match
7. **Maintain type safety**: Import and use generated types from `@/sanity/types`
8. **Update GROQ queries**: When schema changes, update queries in `lib/queries.ts`
9. **Test preview mode**: After content changes, verify preview functionality
10. **Document new features**: Update this file when adding significant functionality

### File Path References

When referencing code locations, use the format: `file_path:line_number`

Example: "The schema composition happens in `apps/studio/schemaTypes/index.ts:10`"

### Context Gathering

For broad exploration tasks (e.g., "understand error handling"), use the Task tool with `subagent_type=Explore` instead of direct Grep/Glob commands.

### Code Quality

- Run `pnpm biome` before committing
- Ensure TypeScript compiles without errors
- Follow existing patterns and conventions
- Keep components focused and single-purpose

---

**Last Updated**: 2025-11-24
**Codebase Version**: Day One Content Operations v1.0.0
**Maintained By**: Project team

---

*This file is optimized for AI assistants like Claude Code. For human-readable documentation, see README.md and WARP.md.*
- Never use 'any' type for type declarations. Create type interfaces.