# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 힘이나는커피생활 (ddarumin) - Coffee Franchise Website

A modern coffee franchise website built with Next.js 15, Supabase, Prisma, Shadcn UI, and Tailwind CSS v4. This project serves both public customers and franchise administrators.

## Development Commands

```bash
# Development
npm run dev                    # Start development server (http://localhost:3000)
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Database Management
npx prisma generate           # Generate Prisma client
npx prisma migrate dev        # Create and apply migrations
npx prisma studio            # Open Prisma Studio GUI
npx prisma db push           # Push schema changes without migration

# Testing Database Connection
npx prisma db execute --url $DATABASE_URL --file /dev/stdin

# Create Initial Admin User
npx tsx scripts/create-admin.ts   # Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
```

## High-Level Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (using @import syntax), Shadcn UI components
- **Database**: Supabase PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth with middleware protection
- **File Storage**: Supabase Storage for images

### Project Structure
```
/app                    # Next.js App Router
  /admin               # Admin panel (protected routes)
    /login            # Admin login page
    /posts            # Content management (inquiries, sessions, FAQs)
    /menus            # Menu and category management
    /stores           # Store management
    /events           # Event management
    /system           # System administration
  /(public)           # Public website routes
  /api                # API routes for admin operations
/components
  /admin              # Admin-specific components
  /ui                 # Shadcn UI components
/lib
  /supabase          # Supabase client configurations
  /prisma            # Database utilities
/hooks               # Custom React hooks (useAuth)
/types               # TypeScript type definitions
/prisma              # Database schema and migrations
/scripts             # Utility scripts
```

### Key Architectural Decisions

1. **Authentication Flow**: 
   - Supabase Auth handles user authentication
   - Middleware checks admin status in database
   - Protected routes redirect to login when unauthorized

2. **Database Design**:
   - All models defined in `/prisma/schema.prisma`
   - Uses enums for status fields and predefined options
   - Junction table (EventStore) for many-to-many relationships

3. **State Management**:
   - Server components fetch data directly
   - Client components use hooks for auth state
   - No global state management needed (Supabase handles auth state)

4. **File Organization**:
   - Colocation pattern: components near their routes
   - Shared components in `/components`
   - Type safety through generated Prisma types

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://...              # For Prisma
DIRECT_URL=postgresql://...               # For migrations
SUPABASE_SERVICE_ROLE_KEY=...            # For admin operations (optional)
```

## Important Context Files

- `/docs/requirements.md` - Complete project requirements and database schema
- `/.taskmaster/docs/prd.txt` - Product Requirements Document with development roadmap
- `/prisma/schema.prisma` - Database models (already implemented)

## Current Project Status

### Completed Tasks
- ✅ Task 1: Project initialization and infrastructure setup
- ✅ Task 2: Database schema design and migration (all models created)
- ✅ Task 3: Supabase Auth integration and admin authentication system

### Authentication System Details
- Admin login at `/admin/login`
- Protected routes under `/admin/*`
- Middleware handles auth checks in `/lib/supabase/middleware.ts`
- `useAuth` hook available for client components
- Password change functionality at `/admin/profile/password`

## Task Master Integration

This project uses Task Master AI for task management. Current tasks can be viewed with `task-master list`.

### Core Workflow Commands

```bash
# Project Setup
task-master init                                    # Initialize Task Master in current project
task-master parse-prd .taskmaster/docs/prd.txt      # Generate tasks from PRD document
task-master models --setup                        # Configure AI models interactively

# Daily Development Workflow
task-master list                                   # Show all tasks with status
task-master next                                   # Get next available task to work on
task-master show <id>                             # View detailed task information
task-master set-status --id=<id> --status=done    # Mark task complete
```

### Task Master Files
- `.taskmaster/tasks/tasks.json` - Main task database
- `.taskmaster/docs/prd.txt` - Product Requirements Document
- `.mcp.json` - MCP server configuration for Task Master integration

For detailed Task Master usage, refer to the original Task Master documentation.
