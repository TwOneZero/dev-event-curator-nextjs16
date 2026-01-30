## ADDED Requirements

### Requirement: Delete event by slug via API

The system SHALL provide a DELETE endpoint at /api/events/[slug] that removes an event from the database.

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
- **AND** the function returns the deleted event data

### Requirement: Cloudinary image cleanup

The system SHALL delete the event image from Cloudinary when the event is deleted.

#### Scenario: Successful image cleanup

- **WHEN** an event with a Cloudinary-hosted image is deleted
- **THEN** the image is removed from Cloudinary storage

#### Scenario: Image cleanup failure handling

- **WHEN** Cloudinary deletion fails during event deletion
- **THEN** the event is still deleted from the database
- **AND** the error is logged for manual cleanup
