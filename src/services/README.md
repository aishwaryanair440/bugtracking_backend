# services/

This folder contains **service files**.

Services handle the **business logic** of the application — the "thinking" layer between controllers and the database.

## Example
When a controller receives a request to create a bug report, the controller calls a service.
The service handles steps like:
- Validating the data
- Calling the database (Supabase)
- Returning the result back to the controller

## Future files (examples)
- `bugService.js` — logic for creating, updating, fetching bugs
- `projectService.js` — logic for managing projects
- `userService.js` — logic for user-related operations
