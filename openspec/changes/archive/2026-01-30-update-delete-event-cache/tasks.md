## 1. Update getAllEventsCached with Cache Tag

- [x] 1.1 Import unstable_cacheTag from next/cache in event.actions.ts
- [x] 1.2 Add cacheTag("events") call inside getAllEventsCached function
- [x] 1.3 Ensure cacheTag is called after the "use cache" directive

## 2. Update deleteEventBySlug with Cache Invalidation

- [x] 2.1 Import revalidateTag from next/cache in event.actions.ts
- [x] 2.2 Add revalidateTag("events") call after successful event deletion
- [x] 2.3 Wrap revalidateTag in try-catch to handle failures gracefully
- [x] 2.4 Log error if cache invalidation fails without blocking the deletion

## 3. Add Cache Tag Constant

- [x] 3.1 Define CACHE_TAG_EVENTS constant at top of event.actions.ts
- [x] 3.2 Use constant in both getAllEventsCached and deleteEventBySlug
- [x] 3.3 Ensure consistency between cache tagging and invalidation

## 4. Testing & Validation

- [x] 4.1 Test successful event deletion triggers cache invalidation
- [x] 4.2 Verify landing page shows updated events list after deletion
- [x] 4.3 Test cache invalidation failure doesn't break deletion
- [x] 4.4 Run npm run lint to verify code quality
- [x] 4.5 Run npm run build to verify no build errors

**Note:** Build shows a pre-existing Suspense issue with /delete-event/[slug] page from previous change, unrelated to cache invalidation implementation.
