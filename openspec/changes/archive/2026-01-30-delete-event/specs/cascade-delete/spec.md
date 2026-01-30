## ADDED Requirements

### Requirement: Cascade delete bookings

The system SHALL delete all bookings associated with an event when the event is deleted.

#### Scenario: Delete event with bookings

- **WHEN** an event with associated bookings is deleted
- **THEN** all bookings with matching eventId are removed from the database
- **AND** the event is removed from the database

#### Scenario: Delete event without bookings

- **WHEN** an event with no associated bookings is deleted
- **THEN** the event is removed from the database
- **AND** no error occurs due to missing bookings

### Requirement: Cascade delete order

The system SHALL delete bookings before deleting the event to maintain data integrity.

#### Scenario: Booking deletion order

- **WHEN** an event deletion is initiated
- **THEN** all associated bookings are deleted first
- **AND** then the event is deleted
