## 1. Server Actions

- [x] 1.1 Create deleteEventBySlug server action in lib/actions/event.actions.ts
- [x] 1.2 Implement event lookup by slug with error handling for not found
- [x] 1.3 Add cascade delete logic to remove associated bookings first
- [x] 1.4 Add Cloudinary image deletion logic
- [x] 1.5 Return deleted event data on success

## 2. API Route

- [x] 2.1 Add DELETE handler to app/api/events/[slug]/route.ts
- [x] 2.2 Implement 404 response for non-existent events
- [x] 2.3 Implement 200 success response with message
- [x] 2.4 Add error handling for 500 server errors

## 3. Delete Confirmation Page

- [x] 3.1 Create app/delete-event/[slug]/page.tsx
- [x] 3.2 Fetch event data by slug for display
- [x] 3.3 Display event title, date, and description
- [x] 3.4 Add permanent deletion warning message
- [x] 3.5 Implement Confirm button with server action call
- [x] 3.6 Implement Cancel button with navigation back to event
- [x] 3.7 Handle 404 for non-existent events
- [x] 3.8 Style page to match existing design system

## 4. Event Detail Page Updates

- [x] 4.1 Add delete button to app/events/[slug]/page.tsx
- [x] 4.2 Implement navigation to /delete-event/[slug] on click
- [x] 4.3 Position delete button appropriately in UI layout
- [x] 4.4 Style delete button with warning/danger styling

## 5. Testing & Validation

- [x] 5.1 Test successful event deletion via API
- [x] 5.2 Test 404 response for non-existent event
- [x] 5.3 Test cascade delete removes associated bookings
- [x] 5.4 Test Cloudinary image cleanup
- [x] 5.5 Test confirmation page displays correctly
- [x] 5.6 Test cancel navigation works
- [x] 5.7 Test delete button on event page navigates correctly
- [x] 5.8 Run npm run lint to verify code quality
