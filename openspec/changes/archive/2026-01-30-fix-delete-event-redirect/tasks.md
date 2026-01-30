## 1. Fix Error Handling in Delete Event Page

- [x] 1.1 Open `app/delete-event/[slug]/page.tsx`
- [x] 1.2 Locate the `handleDelete` server action function (lines 28-38)
- [x] 1.3 Modify the catch block to check for NEXT_REDIRECT error before logging
- [x] 1.4 Add logic to detect redirect errors using error.digest property
- [x] 1.5 Ensure redirect errors are re-thrown without logging
- [x] 1.6 Ensure actual errors are still logged and re-thrown

## 2. Verify the Fix

- [x] 2.1 Test successful event deletion - verify redirect works without error logs
- [x] 2.2 Test error scenarios (if possible) - verify actual errors are still logged
- [x] 2.3 Run the application and check browser console for any errors during deletion
- [x] 2.4 Run `npm run lint` to ensure code style compliance
