This file provides guidance to AI Agents when working with code in this repository.

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

## Project Status

### Implemented Features ✅

**Event Management:**
- Full CRUD operations (Create, Read, Delete events)
- Create event with Cloudinary image upload via `POST /api/events`
- Delete event with cascade deletion (bookings + Cloudinary images)
- Automatic slug generation from title
- Date/time normalization (ISO 8601 dates, 24-hour time format)

**Event Discovery:**
- Landing page with all events display
- Individual event detail pages (`/events/[slug]`)
- Similar events recommendation based on matching tags
- Responsive event cards with metadata

**Data Layer:**
- MongoDB + Mongoose ODM with connection caching
- Event model with pre-save hooks for data normalization
- Booking model for event registrations (email-based)

**Caching:**
- Next.js 16 `use cache` directive with cache tags
- Targeted cache invalidation via `revalidateTag`
- Optimistic UI updates

**Analytics:**
- PostHog integration for user behavior tracking
- Page view and interaction monitoring

**Mock Implementation:**
- Event booking form UI (`components/BookEvent.tsx`)
- Currently simulated - no real backend integration
- Email-based registration form without confirmation

### Not Yet Implemented ❌

**Authentication & Authorization:**
- No user authentication system
- No role-based access control (admin/user roles)
- No protected routes for CRUD operations
- Currently anyone can create/delete events

**Real Booking System:**
- Booking form is UI only (mocked)
- No backend API for actual bookings
- No email confirmation service
- No calendar integration (.ics files)
- No payment processing for paid events

**Enhanced Features:**
- Search and filtering capabilities
- Event categories and advanced filters
- User profiles and saved events
- Comment/review system
- Real-time notifications

## API Reference

### REST Endpoints (`app/api/`)

```
GET /api/events
  - Returns all events sorted by createdAt (newest first)
  - Used by landing page

POST /api/events
  - Creates new event with image upload
  - Accepts FormData with image file + event JSON
  - Uploads image to Cloudinary, stores secure_url
  - Returns created event document

GET /api/events/[slug]
  - Returns single event by slug
  - Used by event detail page

DELETE /api/events/[slug]
  - Deletes event by slug
  - Cascade deletes all associated bookings
  - Deletes associated Cloudinary image
  - Invalidates "events" cache tag
```

### Server Actions (`lib/actions/event.actions.ts`)

```typescript
getAllEventsCached()
  - "use cache" directive with cacheTag("events")
  - Returns all events sorted by createdAt: -1
  - Used by server components for better performance

getEventBySlug(slug: string)
  - Fetches single event by slug
  - Throws error if not found
  - Returns plain JS object (lean)

getSimilarEventsBySlug(slug: string)
  - Finds events with matching tags
  - Excludes current event from results
  - Returns up to 4 events, sorted by oldest first

deleteEventBySlug(slug: string)
  - Cascade deletes bookings (Booking.deleteMany)
  - Deletes Cloudinary image if present
  - Invalidates "events" cache tag
  - Returns deleted event document
```

## Data Models

### Event Schema (`database/event.model.ts`)

```typescript
interface IEvent {
  title: string;        // Auto-generates slug
  slug: string;         // Unique, lowercase, hyphenated
  description: string;  // Short description
  overview: string;     // Detailed overview
  image: string;        // Cloudinary URL
  venue: string;
  location: string;
  date: string;         // ISO format (YYYY-MM-DD)
  time: string;         // 24-hour format (HH:MM)
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];     // Array of agenda items
  organizer: string;
  tags: string[];       // Array of tags for similarity matching
  createdAt: Date;
  updatedAt: Date;
}
```

**Pre-save Hooks:**
- Slug generation from title (removes special chars, replaces spaces with hyphens)
- Date normalization to ISO format (YYYY-MM-DD)
- Time normalization to 24-hour format (converts "HH:MM AM/PM" to "HH:MM")

### Booking Schema (`database/booking.model.ts`)

```typescript
interface IBooking {
  eventId: mongoose.Schema.Types.ObjectId;  // References Event
  email: string;  // RFC 5322 compliant
}
```

**Constraints:**
- Unique compound index on `(eventId, email)` prevents duplicate bookings
- Cascade validation ensures referenced event exists

## Key Implementation Patterns

### Cascade Delete Pattern

When deleting an event:
1. Find event by slug to verify existence
2. Delete all bookings: `await Booking.deleteMany({ eventId: event._id })`
3. Delete Cloudinary image if present (extract public_id from URL)
4. Delete event document: `await Event.findOneAndDelete({ slug })`
5. Invalidate cache: `revalidateTag("events")`

Reference: `lib/actions/event.actions.ts:75-129`

### Cache Invalidation Pattern

```typescript
// When creating/updating data
"use cache";
cacheTag("events");

// When mutating data
revalidateTag("events", { expire: 0 });
```

This ensures all cached queries with the "events" tag are invalidated and refetched on next request.

### Image Upload Flow

1. Client sends FormData with image file to `POST /api/events`
2. API route extracts file from FormData
3. Stream file buffer to Cloudinary via `cloudinary.uploader.upload_stream`
4. Store returned `secure_url` in event document
5. On delete: extract `public_id` from URL and destroy via Cloudinary API

## Git Workflow

**CRITICAL**: All feature development MUST follow the branching strategy defined in `.claude/rules/git-workflow.md`.

### Quick Reference
- Always create feature branch: `feat/{feature-name}`
- Never commit directly to `main`
- Follow conventional commits: `feat(scope):`, `fix(scope):`, `chore:`, `docs:`
- Create PR before merging to main

See `.claude/rules/git-workflow.md` for complete workflow details.

## Development Workflow Notes

### Before Starting New Features
1. Check current branch: `git branch`
2. If on `main`, create feature branch first
3. Follow git-workflow.md rules

### When Implementing Auth (Future)
- Current booking system is mocked - will need real backend integration
- Consider role-based access (admin vs users)
- Add protected routes for event CRUD operations
- Implement user profiles for booking history

### When Implementing Real Booking (Future)
- Backend API for booking creation
- Email confirmation service (SendGrid, Resend, etc.)
- Calendar invite generation (.ics files)
- Consider payment integration (Stripe) for paid events

