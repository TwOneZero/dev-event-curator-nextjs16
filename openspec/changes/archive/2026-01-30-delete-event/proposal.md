## Why

The application currently allows creating and viewing events but lacks the ability to delete them. Event organizers need a way to remove cancelled or outdated events from the platform. This feature is essential for content management and maintaining an accurate event catalog.

## What Changes

- **DELETE /api/events/[slug]**: New API endpoint to delete events by slug
- **Delete Event Page**: New page at `/delete-event/[slug]` with confirmation UI
- **Delete Event Button**: Add delete button to event detail page for authorized users
- **Cascade Delete**: When an event is deleted, all associated bookings should also be removed
- **Cloudinary Cleanup**: Delete event images from Cloudinary when events are removed

## Capabilities

### New Capabilities

- `event-deletion`: API endpoint and server action for deleting events by slug with proper error handling
- `delete-confirmation-ui`: Page component with confirmation dialog for destructive action
- `cascade-delete`: Handling related data cleanup (bookings) when events are deleted

### Modified Capabilities

- _(none)_

## Impact

- **API Routes**: New DELETE handler in `app/api/events/[slug]/route.ts`
- **Server Actions**: New `deleteEventBySlug` action in `lib/actions/event.actions.ts`
- **Pages**: New `app/delete-event/[slug]/page.tsx` with confirmation UI
- **Database**: Booking model queries for cascade delete
- **Cloudinary**: Image cleanup integration
- **Event Detail Page**: Addition of delete button with authorization check
