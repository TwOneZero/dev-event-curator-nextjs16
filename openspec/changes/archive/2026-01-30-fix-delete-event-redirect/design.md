## Context

The delete event page uses a Server Action (`handleDelete`) that calls `deleteEventBySlug()` followed by `redirect("/")`. Next.js's `redirect()` function throws a `NEXT_REDIRECT` error internally to trigger the navigation. The current code wraps the entire operation in a try-catch block, which catches this redirect error and logs it as an actual error.

## Goals / Non-Goals

**Goals:**

- Fix error handling to properly handle the `NEXT_REDIRECT` error
- Eliminate false error logging
- Keep actual error handling intact for real failures

**Non-Goals:**

- No architectural changes
- No new dependencies
- No changes to user-facing behavior

## Decisions

**Decision: Check error digest before logging**

- **Choice**: Check if caught error has `digest` property containing "NEXT_REDIRECT" before logging
- **Rationale**: Next.js uses this digest pattern for internal errors like redirects. This is the standard pattern in Next.js for distinguishing redirect errors from actual errors.
- **Alternative considered**: Using `instanceof` checks - rejected because Next.js redirect errors are not exported classes

**Decision: Rethrow redirect error**

- **Choice**: After detecting redirect error, rethrow it to allow Next.js to complete the redirect
- **Rationale**: The redirect must still happen - we just don't want to log it as an error

## Risks / Trade-offs

- **Risk**: If Next.js changes the error format in future versions, the check might fail
  - **Mitigation**: This is a well-established pattern in Next.js and unlikely to change
- **Risk**: Other Next.js internal errors might also use digest pattern
  - **Mitigation**: We specifically check for "NEXT_REDIRECT" substring

## Migration Plan

No migration needed - this is a simple code fix with no data or deployment changes.
