## Context

The application is a Next.js 16 event management platform with component caching enabled (`cacheComponents: true` in next.config.ts). The landing page uses `getAllEventsCached()` which employs Next.js 16's `"use cache"` directive to cache the events list. When an event is deleted via `deleteEventBySlug()`, the cached data in `getAllEventsCached()` becomes stale, causing the deleted event to still appear on the landing page until the cache expires naturally.

## Goals / Non-Goals

**Goals:**

- Ensure deleted events are immediately removed from the landing page cache
- Implement cache invalidation that triggers when `deleteEventBySlug()` succeeds
- Use Next.js 16's `revalidateTag` for targeted cache invalidation
- Maintain atomicity - only invalidate cache after successful database deletion

**Non-Goals:**

- Re-architecting the entire caching strategy
- Implementing cache invalidation for other operations (create, update) - out of scope
- Adding cache invalidation for individual event pages - focus is on landing page events list only
- Implementing real-time updates or WebSocket notifications

## Decisions

**1. Cache Invalidation Method: `revalidateTag` vs `revalidatePath`**

- Decision: Use `revalidateTag` with a specific cache tag
- Rationale: `revalidateTag` is more targeted and efficient. Using `revalidatePath('/')` would invalidate all caches for the root path, which is unnecessary. A specific tag like `"events"` allows precise invalidation.
- Alternative: `revalidatePath('/')` - rejected because it's too broad and could affect other cached components on the landing page.

**2. Cache Tag Naming**

- Decision: Use `"events"` as the cache tag for the events list
- Rationale: Simple, descriptive, and follows the domain model. Can be reused if other components need to invalidate the events cache.
- Alternative: `"all-events"` or `"events-list"` - rejected for simplicity, "events" is sufficient.

**3. Where to Add Cache Invalidation**

- Decision: Add `revalidateTag` call inside `deleteEventBySlug()` after successful deletion
- Rationale: The cache invalidation should be tightly coupled with the delete operation to ensure they always happen together. The server action is the right place because it already handles the database operation.
- Alternative: Create a separate cache management utility - rejected for unnecessary abstraction when it's a single function call.

**4. Error Handling for Cache Invalidation Failure**

- Decision: Log error but don't fail the delete operation if cache invalidation fails
- Rationale: The database deletion is the critical operation. Cache invalidation failure is recoverable (cache will eventually expire). We should not roll back a successful deletion due to cache issues.
- Alternative: Make cache invalidation mandatory (throw error if it fails) - rejected because it could cause data inconsistency or user confusion.

## Risks / Trade-offs

**[Risk] Cache invalidation fails silently**
→ Mitigation: Log errors to console. Cache will naturally expire eventually. Monitor error logs for patterns.

**[Risk] Race condition between delete and cache regeneration**
→ Mitigation: Acceptable risk. If user refreshes immediately after delete, they might see stale data for one request until cache is regenerated. Next.js handles cache regeneration on-demand.

**[Risk] Tag mismatch between cache and invalidation**
→ Mitigation: Use a shared constant for the cache tag to ensure consistency. Define `CACHE_TAG_EVENTS = "events"` and use it in both `getAllEventsCached` and `deleteEventBySlug`.

**[Trade-off] Cache invalidation scope**
→ Using tag-based invalidation means we invalidate all events caches, not just the one that changed. This is acceptable because we only have one events list cache. If we had multiple filtered views, we might need more granular tags.

## Migration Plan

Not applicable - this is a modification to existing functionality with no breaking changes or data migration required.

## Open Questions

None at this time.
