## MODIFIED Requirements

### Requirement: Delete event by slug via API

The system SHALL provide a DELETE endpoint at /api/events/[slug] that removes an event from the database and invalidates the cached events list.

#### Scenario: Successful event deletion via API

- **WHEN** a DELETE request is sent to /api/events/[slug] with a valid slug
- **THEN** the event is removed from the database
- **AND** the response returns status 200 with message "Event deleted successfully"

#### Scenario: Event not found

- **WHEN** a DELETE request is sent with a non-existent slug
- **THEN** the response returns status 404 with message "Event not found"

#### Scenario: Delete event server action

- **WHEN** the deleteEventBySlug server action is called with a valid slug
- **THEN** the event is removed from the database
- **AND** the cached events list is invalidated
- **AND** the function returns the deleted event data

#### Scenario: Cache invalidation on successful deletion

- **WHEN** an event is successfully deleted via deleteEventBySlug
- **THEN** the cache tag "events" is invalidated via revalidateTag
- **AND** the landing page events list is regenerated on next request

#### Scenario: Cache invalidation failure handling

- **WHEN** cache invalidation fails during event deletion
- **THEN** the event deletion still succeeds
- **AND** the cache invalidation error is logged

### Requirement: Cached events list

The system SHALL cache the events list with a specific cache tag to enable targeted invalidation.

#### Scenario: Events list is cached with tag

- **WHEN** the getAllEventsCached function is called
- **THEN** the events list is cached with the tag "events"
- **AND** the cache can be invalidated by this tag
