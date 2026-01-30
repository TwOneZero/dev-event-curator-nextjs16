# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server (Next.js)
- `npm run build` - Build the production bundle
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Automatically fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Environment Variables

Required environment variables (see `.env.example`):

- `MONGODB_URI` - MongoDB connection string for the database
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key
- `NEXT_PUBLIC_POSTHOG` - PostHog host URL
- `CLOUDINARY_URL` - Cloudinary API URL for image uploads

## Architecture Overview

This is a Next.js 16 application for discovering and booking developer events. The architecture follows the App Router pattern with:

### Database Layer

- **MongoDB + Mongoose**: All data persistence uses MongoDB via Mongoose ODM
- **Connection caching**: `lib/mongodb.ts` implements a cached connection pattern to prevent multiple connections during development hot-reloading
- **Models** (`database/` directory):
  - `Event` model: Core event data with slug auto-generation, date/time normalization
  - `Booking` model: Event bookings with email validation and duplicate prevention
  - Both models export TypeScript interfaces (`IEvent`, `IBooking`)

### Server Actions vs API Routes

The codebase uses two patterns for data access:

1. **Server Actions** (`lib/actions/event.actions.ts`):
   - `'use server'` directive for server-side functions
   - Used for direct server component data fetching
   - `getAllEventsCached()` uses Next.js 16's `'use cache'` directive for performance

2. **API Routes** (`app/api/`):
   - RESTful endpoints for external client calls
   - `POST /api/events` - Create events with Cloudinary image upload
   - `GET /api/events` - Fetch all events
   - `GET /api/events/[slug]` - Fetch single event by slug

### Next.js Configuration

- `cacheComponents: true` is enabled in `next.config.ts` for Next.js 16 partial component caching
- Remote image patterns configured for Cloudinary and ui-avatars.com

### Visual Components

- **LightRays** (`components/LightRays.tsx`): WebGL-based animated background using the `ogl` library. This is a client component with extensive WebGL shader code for ray animation effects.
- **PostHog**: Analytics integrated via `app/providers.tsx` and `app/PostHogPageView.tsx`

### Path Aliases

- `@/` maps to the project root
- `@/database` exports all models and interfaces from `database/index.ts`
- `@/lib` for utilities (mongodb connection, constants, actions)

## Key Patterns

### Date/Time Handling

Event model normalizes dates to ISO format (YYYY-MM-DD) and times to 24-hour format (HH:MM) via pre-save hooks.

### Slug Generation

Event slugs are auto-generated from titles via pre-save hook (lowercase, hyphenated, special chars removed).

### Image Uploads

Events use Cloudinary for image storage. The API route handles `FormData` uploads, streams the image buffer to Cloudinary, and stores the returned `secure_url`.

### MongoDB Query Patterns

- Use `.lean()` for read operations to get plain JavaScript objects (better performance)
- Serialize with `JSON.parse(JSON.stringify(data))` for Next.js data compatibility
- Events are typically sorted by `createdAt: -1` (newest first)
