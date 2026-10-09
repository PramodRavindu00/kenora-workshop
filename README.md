# Kenora

Workshop registration system. The backend is NestJS with PostgreSQL and Prisma. The frontend is React with Vite.

## Completed

Only the platform foundation is done:

- **Authentication.** Login issues a JWT access token. Protected routes require a Bearer token. Public routes can opt out. Inactive accounts are rejected.
- **Role-based access control.** Roles are `ADMIN`, `MANAGER`, and `STAFF`. Routes can require one or more roles. A signed-in user without an allowed role is denied.
- **Database schema design.** The Prisma schema and initial migration define users, locations, workshops, attendees, and registrations, including workshop and registration status.

## Not completed

The core business is not implemented on the backend:

- **Workshop management** is not done. The workshop module is still a scaffold and does not run the real workshop flow.
- **Registration management** is not done. The registration module is still a scaffold and does not register or cancel attendees.

**The entire frontend is not done.** It is still the default Vite React starter. There are no screens for sign-in, workshops, or registrations.
