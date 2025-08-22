# Overview

STATUS CONTACTS🇭🇹 is a full-stack professional platform for collecting and managing WhatsApp contacts with a multilingual interface and administrative dashboard. The application serves as a contact collection system where users can register with their contact information and gain access to a WhatsApp group containing VCF files with community contacts. The platform includes a public registration interface with real-time counters and an admin dashboard for managing contacts, sending broadcasts, and configuring system settings.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with Vite**: Modern frontend framework with fast build tooling
- **Component System**: Utilizes Shadcn UI components built on Radix UI primitives for consistent design
- **Styling**: Tailwind CSS for utility-first styling with CSS variables for theming
- **State Management**: React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Routing**: Wouter for lightweight client-side routing
- **Internationalization**: i18next for multi-language support (French, English, Spanish)
- **Theme System**: Context-based dark/light mode with localStorage persistence

## Backend Architecture
- **Express.js Server**: RESTful API with middleware for authentication and logging
- **Session Management**: Express-session with PostgreSQL store for admin authentication
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Authentication**: Simple credential-based admin authentication with 24-hour sessions
- **File Generation**: Custom utilities for VCF and CSV export functionality
- **Email Service**: Nodemailer integration for SMTP-based email broadcasts

## Data Storage
- **Primary Database**: PostgreSQL via Supabase for hosted database solution
- **Schema Design**: Two main tables - contacts (user registrations) and settings (system configuration)
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Phone Number Handling**: libphonenumber-js for international phone number validation and formatting

## API Structure
- **Public Endpoints**: Contact registration, public statistics, and settings
- **Admin Endpoints**: Full CRUD operations for contacts, settings management, export functions, and email broadcasting
- **Authentication Middleware**: Route protection for admin-only endpoints
- **File Downloads**: Protected endpoints for VCF/CSV exports with proper headers

## Security Considerations
- **Session Security**: HTTP-only cookies with secure flags in production
- **Input Validation**: Server-side validation for all user inputs
- **Phone Validation**: International phone number format validation
- **Admin Access**: Hard-coded credentials with session-based authentication
- **CORS Handling**: Configured for cross-origin requests with credentials

## Performance Features
- **Caching Strategy**: React Query with configurable stale times for different data types
- **Real-time Updates**: Automatic refresh intervals for dynamic counters and statistics
- **Optimistic Updates**: Immediate UI feedback with background data synchronization
- **Lazy Loading**: Component-based code splitting with Vite

# External Dependencies

## Database Services
- **Supabase**: Hosted PostgreSQL database with connection pooling and built-in security features

## Email Services
- **SMTP Provider**: Configurable SMTP settings for transactional emails and broadcasts via Nodemailer

## Phone Number Validation
- **libphonenumber-js**: Google's libphonenumber library for international phone number parsing and validation

## UI Component Libraries
- **Radix UI**: Headless UI components for accessibility and functionality
- **Shadcn UI**: Pre-built component system based on Radix primitives

## Development Tools
- **Vite**: Build tool with hot module replacement and optimized production builds
- **TypeScript**: Type safety across the entire application stack
- **Tailwind CSS**: Utility-first CSS framework with design system integration

## Third-party Integrations
- **WhatsApp Groups**: External WhatsApp group integration for community access
- **Social Media**: Configurable social media links for platform presence
- **Font Awesome**: Icon library for consistent iconography

## Build and Deployment
- **ESBuild**: Fast JavaScript bundler for server-side code
- **Drizzle Kit**: Database migration and schema management tools
- **Environment Configuration**: Flexible environment variable handling for different deployment contexts