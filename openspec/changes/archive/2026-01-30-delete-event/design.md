## Context

The application is a Next.js 16 event management platform using MongoDB/Mongoose for data persistence. Events can be created via POST /api/events and viewed via /events/[slug]. Currently there is no deletion capability, requiring manual database intervention to remove events. This design addresses the technical approach for implementing a complete delete workflow.

## Goals / Non-Goals

**Goals:**

- Implement secure event deletion with confirmation flow
- Ensure data integrity through cascade delete of related bookings
- Follow existing codebase patterns (server actions, API routes, MongoDB)
- Provide clear user feedback during deletion process
- Clean up Cloudinary assets when events are removed

**Non-Goals:**

- Soft delete / archive functionality (hard delete only)
- Role-based authorization (assume all users can delete for now)
- Batch deletion of multiple events
- Event restoration after deletion

## Decisions

**1. DELETE API Endpoint vs Server Action Only**

- Decision: Provide both DELETE API endpoint and server action
- Rationale: Server actions for internal Next.js usage, API endpoint for external clients or future mobile apps
- Alternative: Server actions only - rejected for API consistency with existing POST/GET endpoints

**2. Cascade Delete Strategy**

- Decision: Delete all associated bookings when event is deleted
- Rationale: Bookings are tightly coupled to events; orphaned bookings have no value
- Implementation: Query Booking model by event title (current coupling mechanism) before deleting event

**3. Cloudinary Cleanup Approach**

- Decision: Extract public_id from image URL and delete via Cloudinary API
- Rationale: Prevents orphaned images in Cloudinary storage
- Alternative: Keep images (rejected - wastes storage, images are event-specific)

**4. Confirmation Page vs Modal**

- Decision: Dedicated page at /delete-event/[slug] with confirmation
- Rationale: Destructive action deserves full page context; easier to implement cancel navigation
- Alternative: Modal on event page - rejected for cleaner separation of concerns

**5. Error Handling Pattern**

- Decision: Follow existing pattern: return JSON with message and status codes
- Rationale: Consistency with existing API error handling in GET/POST endpoints

## Risks / Trade-offs

**[Risk] Accidental deletion without recovery**
→ Mitigation: Two-step confirmation page with event details displayed; future enhancement could add soft delete

**[Risk] Cascade delete removes booking data permanently**
→ Mitigation: This is intentional behavior per requirements; no mitigation needed but clearly documented

**[Risk] Cloudinary deletion failure leaves orphaned image**
→ Mitigation: Log error but don't block event deletion; consider cleanup job for orphaned images

**[Risk] Race condition: event deleted between page load and confirmation**
→ Mitigation: Re-fetch event before deletion to verify existence; return 404 if already deleted

**[Trade-off] Hard delete vs Soft delete**
→ Chose hard delete for simplicity; soft delete would require status field and filter changes across all queries

## Migration Plan

Not applicable - this is a new feature with no migration requirements.

## Open Questions

None at this time.
