## Why

The delete event page at `app/delete-event/[slug]/page.tsx` throws an unnecessary error when redirecting after successful deletion. Next.js's `redirect()` function intentionally throws a `NEXT_REDIRECT` error to trigger the redirect, but the current implementation catches and logs this as an actual error, creating noise in error logs and potentially confusing developers.

## What Changes

- Fix error handling in `handleDelete` server action to properly distinguish between actual errors and the expected `NEXT_REDIRECT` error
- Remove misleading error logging for the redirect case
- Maintain proper error handling for actual deletion failures

## Capabilities

### New Capabilities

- (none - this is a bug fix with no new capabilities)

### Modified Capabilities

- (none - this fixes implementation details without changing requirements)

## Impact

- **File**: `app/delete-event/[slug]/page.tsx` - Error handling logic in `handleDelete` function
- **Behavior**: Cleaner error logs, no false error reports
- **API**: No changes to external API or behavior
- **Dependencies**: None
