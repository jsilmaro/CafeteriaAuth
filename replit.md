# Overview

This is a full-stack web application for a USTP (University of Science and Technology of the Philippines) Cafeteria Staff Portal. The application provides authentication and dashboard functionality for cafeteria staff members. It's built with a modern tech stack featuring React on the frontend, Express.js on the backend, and PostgreSQL with Drizzle ORM for data persistence.

The application follows a monorepo structure with clear separation between client-side code, server-side code, and shared resources. It implements a complete authentication system with session management and provides a responsive, accessible user interface using modern design patterns.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with **React 18** using **TypeScript** and follows a modern component-based architecture. Key architectural decisions include:

- **UI Framework**: Uses shadcn/ui components built on top of Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with CSS custom properties for theming and dark mode support
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing with protected route implementation
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

The frontend implements a protected route system that redirects unauthenticated users to the login page and provides a clean dashboard interface for authenticated staff members.

## Backend Architecture
The backend uses **Express.js** with **TypeScript** in ESM module format. Core architectural patterns include:

- **Authentication**: Passport.js with local strategy for username/password authentication
- **Session Management**: Express sessions with PostgreSQL store for persistence across server restarts
- **Password Security**: Crypto module with scrypt for secure password hashing with salt
- **Middleware Pattern**: Custom logging middleware for API request tracking and error handling
- **Modular Structure**: Separation of concerns with dedicated modules for auth, database, storage, and routing

The server implements a RESTful API pattern with proper error handling and request logging for debugging and monitoring.

## Data Storage Architecture
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations:

- **Database Client**: Neon serverless PostgreSQL with WebSocket support for modern deployment
- **Schema Management**: Drizzle migrations with schema-first approach for database versioning
- **Type Safety**: Full TypeScript integration from database schema to API responses
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple

The database schema includes a users table with essential fields for staff authentication (id, fullname, staffId, email, password, createdAt) and automatic UUID generation.

## Authentication and Authorization
The authentication system implements several security best practices:

- **Secure Password Storage**: Scrypt algorithm with random salt generation for password hashing
- **Session Security**: Server-side session management with secure session cookies
- **CSRF Protection**: Session-based authentication prevents CSRF attacks
- **Protected Routes**: Client-side route protection with automatic redirects for unauthenticated users
- **Input Validation**: Zod schemas for both client and server-side validation

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern patterns
- **Express.js**: Backend web framework with middleware support
- **TypeScript**: Type safety across the entire application stack

### Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL client with WebSocket support
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **drizzle-kit**: Database migration and schema management tools

### Authentication
- **passport**: Authentication middleware for Express
- **passport-local**: Local username/password authentication strategy
- **express-session**: Session middleware for Express
- **connect-pg-simple**: PostgreSQL session store

### UI and Styling
- **@radix-ui/**: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant generation for components
- **lucide-react**: Modern icon library

### Form and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

The application is designed to be deployed on platforms that support Node.js with PostgreSQL, with specific optimizations for Replit's environment including development banners and runtime error overlays.