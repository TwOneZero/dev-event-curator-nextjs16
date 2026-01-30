## ADDED Requirements

### Requirement: Delete confirmation page

The system SHALL provide a confirmation page at /delete-event/[slug] that displays event details and requires user confirmation before deletion.

#### Scenario: Display confirmation page

- **WHEN** a user navigates to /delete-event/[slug] with a valid slug
- **THEN** the page displays the event title, date, and description
- **AND** the page shows a warning about permanent deletion
- **AND** the page provides Confirm and Cancel buttons

#### Scenario: Event not found on confirmation page

- **WHEN** a user navigates to /delete-event/[slug] with a non-existent slug
- **THEN** the page displays a 404 not found message

### Requirement: Delete button on event detail page

The system SHALL provide a delete button on the event detail page that navigates to the confirmation page.

#### Scenario: Navigate to delete confirmation

- **WHEN** a user clicks the delete button on /events/[slug]
- **THEN** the application navigates to /delete-event/[slug]

### Requirement: Cancel deletion

The system SHALL allow users to cancel the deletion and return to the event page.

#### Scenario: Cancel deletion

- **WHEN** a user clicks Cancel on the confirmation page
- **THEN** the application navigates back to /events/[slug]
