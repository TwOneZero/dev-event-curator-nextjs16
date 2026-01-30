## Why

The project uses Next.js 16 with `cacheComponents: true` enabled in the configuration. The `getAllEventsCached` function uses the `"use cache"` directive to cache all events for the landing page. When an event is deleted via `deleteEventBySlug`, the cached data becomes stale and the landing page continues to display the deleted event until the cache naturally expires. This creates a poor user experience where deleted events still appear on the homepage.

## What Changes

- **Update deleteEventBySlug**: Add cache invalidation logic after successful event deletion to clear the cached events list
- **Cache Tag Integration**: Add cache tags to `getAllEventsCached` for targeted invalidation
- **Revalidate Path**: Use `revalidatePath` or `revalidateTag` from Next.js to clear the cache
- **Atomic Operation**: Ensure cache invalidation happens only after successful database deletion

## Capabilities

### New Capabilities

- _(none)_

### Modified Capabilities

- `event-deletion`: Add cache invalidation requirement to ensure landing page cache is cleared when events are deleted

## Impact

- **Server Actions**: Modify `deleteEventBySlug` in `lib/actions/event.actions.ts`
- **Caching**: Update `getAllEventsCached` to use cache tags for targeted invalidation
- **Landing Page**: Events list will immediately reflect deletions
- **Performance**: Cache will be regenerated on next request rather than waiting for TTL expiration
