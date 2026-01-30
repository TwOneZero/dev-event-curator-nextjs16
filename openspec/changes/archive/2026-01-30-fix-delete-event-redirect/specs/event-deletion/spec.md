## Purpose

Specification for the event-deletion capability, including the delete confirmation page error handling fix.

## MODIFIED Requirements

### Requirement: Delete event server action

The system SHALL delete events via the deleteEventBySlug server action.

#### Scenario: Successful deletion with redirect

- **WHEN** the deleteEventBySlug server action is called with a valid slug
- **THEN** the event is removed from the database
- **AND** the function returns the deleted event data
- **AND** the page redirects to the home page
- **AND** the redirect does not trigger error logging

## Technical Corrections

### Error Handling Fix

**Context**: The delete confirmation page at `app/delete-event/[slug]/page.tsx` uses a Server Action that redirects after successful deletion. Next.js's `redirect()` function throws a `NEXT_REDIRECT` error to trigger navigation.

**Correction**: The error handling must distinguish between:

1. **NEXT_REDIRECT errors**: Internal Next.js errors for navigation - should NOT be logged
2. **Actual errors**: Database failures, network issues, etc. - should be logged

**Implementation Pattern**:

```typescript
if (error && typeof error === "object" && "digest" in error) {
  const digest = (error as { digest: string }).digest;
  if (digest?.includes("NEXT_REDIRECT")) {
    // Don't log - this is expected redirect behavior
    throw error; // Re-throw to complete redirect
  }
}
// Log actual errors
console.error("Error deleting event:", error);
throw error;
```
