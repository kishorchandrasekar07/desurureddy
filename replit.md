# Replit.md

## Overview

This is a full-stack user information collection and admin dashboard application. The system allows public users to submit information through a form (name, phone, category, location), while authenticated administrators can view all submissions grouped by category in a protected dashboard. Built with React frontend, Express backend, and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

**Responsiveness Requirement**: The application must be fully responsive and accessible on mobile phones, laptops, and tablets. All pages and components should adapt gracefully to different screen sizes.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: HTTP server with Vite dev middleware in development
- **API Design**: RESTful endpoints under /api prefix
- **Authentication**: Replit Auth integration using OpenID Connect (OIDC)
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)
- **Validation**: Zod schemas shared between client and server via drizzle-zod

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)
- **Schema Location**: shared/schema.ts (shared between frontend and backend)
- **Migrations**: Drizzle Kit with migrations stored in /migrations folder

### Project Structure
```
client/           # React frontend application
  src/
    components/ui/  # shadcn/ui components
    hooks/          # Custom React hooks
    lib/            # Utilities and query client
    pages/          # Route components (home, admin)
server/           # Express backend
  replit_integrations/auth/  # Replit Auth integration
shared/           # Shared code between frontend and backend
  schema.ts       # Database schema and Zod types
  models/         # Auth-related models
```

### Key Design Decisions

1. **Shared Schema Pattern**: Database schemas and TypeScript types are defined once in shared/schema.ts and used by both frontend (for form validation) and backend (for database operations). This ensures type safety across the stack.

2. **Protected Routes**: Admin endpoints require authentication via the isAuthenticated middleware. Unauthenticated requests receive 401 responses, and the frontend redirects to /api/login.

3. **Grouped Data Pattern**: Submissions are retrieved grouped by category for the admin dashboard, reducing client-side processing.

4. **Component Library**: Uses shadcn/ui "new-york" style with neutral base colors. Components are copied into the project (not imported from a package) for full customization.

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via DATABASE_URL environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OpenID Connect authentication provider
- Required environment variables: ISSUER_URL, REPL_ID, SESSION_SECRET
- Sessions stored in PostgreSQL "sessions" table

### Third-Party Libraries
- **@tanstack/react-query**: Server state management and caching
- **date-fns**: Date formatting utilities
- **zod**: Runtime type validation
- **zod-validation-error**: Human-readable validation error messages
- **memoizee**: Function memoization for OIDC config caching

### Development Tools
- **Vite**: Development server with HMR
- **esbuild**: Production bundling for server
- **tsx**: TypeScript execution for development