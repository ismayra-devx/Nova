# NOVA — Team Productivity Platform
> **Plan. Collaborate. Deliver.**

A modern, full-stack project management web application engineered for teams to manage projects, organize Kanban tasks, collaborate seamlessly, and track progress in real-time.

Built according to the **Full Stack Development Intern Assignment** specifications, Product Requirements Document (PRD), and Technical Requirements.

---

## 🚀 Key Features

### 1. Authentication & Security
- **Authentication**: Sign-up, sign-in, persistent sessions, and secure sign-out.
- **Route Protection**: Unauthenticated visitors are automatically guarded and redirected to the login flow.
- **Demo Mode**: 1-click demo sign-in for Project Owners (`alex@nova.team`) and Team Members (`sarah@nova.team`, `marcus@nova.team`).
- **Security**: PostgreSQL Row Level Security (RLS) policies and server-side authorization on every mutation.

### 2. Dashboard
- **Executive Metrics**: High-level overview cards displaying active projects, in-progress tasks, completed deliverables, and completion rates.
- **Project Cards**: Responsive cards showcasing project titles, descriptions, visual progress bars, task completion counts, and collaborator avatars.
- **Quick Actions**: One-click "New Project" modal with live client and server validation.
- **Search & Empty States**: Instant keyword search and friendly zero-state onboarding.

### 3. Project Workspace
- **Overview Sub-View**: Health indicators, overall completion percentage, total/remaining/completed counts, and team roster.
- **Kanban Task Board**:
  - Three distinct status columns: **To Do**, **In Progress**, and **Completed**.
  - Interactive status stepper: Advance tasks from `TODO` → `IN_PROGRESS` → `DONE` with celebration confetti.
  - Multi-attribute filters: Search query, status, priority (`LOW`, `MEDIUM`, `HIGH`), and assignee.
  - Filter-specific empty states (differentiating between zero tasks and zero matching results).
- **Task Management**:
  - Create, view details, edit, and delete tasks.
  - Due date tracking with automatic **Overdue** alerts for past incomplete tasks.
  - Assign tasks to verified project collaborators.
- **Collaboration & Members**:
  - Invite registered users by email with validation against duplicate membership.
  - Owner-level member removal with **Safe Unassignment Policy** (unassigns member's tasks rather than corrupting records).
- **Destructive Action Protection**:
  - Explicit confirmation dialogs naming the affected item before deleting projects, tasks, or removing members.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Unified full-stack React framework with server and client components |
| **Language** | TypeScript (Strict Mode) | End-to-end type safety across contracts and UI |
| **Styling** | Tailwind CSS v4 | Responsive modern dark SaaS design system |
| **Icons** | Lucide React | Lightweight, consistent UI icons |
| **Validation** | Zod | Shared schema validation on client forms and backend route handlers |
| **Forms** | React Hook Form | High-performance form state and error handling |
| **Database** | PostgreSQL / Supabase | Relational data persistence with foreign keys and cascade rules |
| **Authorization** | PostgreSQL Row Level Security (RLS) | Database-enforced data boundaries |
| **Local Store** | File/JSON Persistent Store | Turnkey offline/demo execution without external dependencies |
| **Testing** | Vitest | Fast unit and integration tests |

---

## 📁 Codebase Architecture

```
nova-platform/
├── data/
│   └── store.json               # Local persistent database store (with initial seed data)
├── public/                      # Static assets and icons
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx   # Sign-in page with 1-click demo accounts
│   │   │   └── signup/page.tsx  # Sign-up page with validation
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx # Authenticated user dashboard
│   │   │   └── projects/
│   │   │       └── [id]/page.tsx  # Project workspace (Overview, Tasks, Members)
│   │   ├── api/
│   │   │   ├── auth/            # Signin, signup, and signout routes
│   │   │   ├── me/route.ts      # Current user profile endpoint
│   │   │   ├── projects/        # Project CRUD and task/member sub-routes
│   │   │   └── tasks/           # Task update, status, and assignee endpoints
│   │   ├── globals.css          # Design tokens and custom scrollbars
│   │   ├── layout.tsx           # Global layout with AuthProvider
│   │   └── page.tsx             # Public landing page
│   ├── components/
│   │   ├── layout/              # Navbar navigation shell
│   │   ├── members/             # MemberList and AddMemberModal
│   │   ├── projects/            # ProjectCard, ProjectModal, DashboardStats, DeleteConfirmModal
│   │   ├── tasks/               # TaskBoard, TaskCard, TaskModal, TaskDetailsModal
│   │   └── ui/                  # Button, Input, Select, Modal, Badge, Card, Avatar, ProgressBar, Skeleton
│   ├── lib/
│   │   ├── auth/                # AuthContext and useAuth hook
│   │   ├── db/                  # Unified data access layer (Supabase + Local fallback)
│   │   ├── supabase/            # Supabase client initializer
│   │   ├── utils/               # Progress calculator and date formatting helpers
│   │   └── validations/         # Zod schemas for all domain entities
│   └── types/
│       ├── api.ts               # Standard API response interfaces
│       └── database.ts          # Relational entities and enums
├── supabase/
│   └── schema.sql               # Production PostgreSQL DDL, RLS policies, and triggers
├── tests/
│   ├── progress.test.ts         # Unit tests for progress calculation
│   └── validation.test.ts       # Unit tests for Zod validation schemas
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment configuration
├── package.json                 # Scripts and dependencies
└── tsconfig.json                # TypeScript configuration
```

---

## 🚦 Getting Started Locally

### Prerequisites
- Node.js 20+ installed
- npm or yarn

### 1. Installation
Clone the repository or navigate to the project root:
```bash
cd nova-platform
npm install
```

### 2. Environment Configuration
The project is configured to work **immediately out of the box** in offline/local persistent mode. If you want to connect to a live Supabase project:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Update the credentials with your Supabase Project settings:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. Run the SQL script from `supabase/schema.sql` in the Supabase SQL Editor.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
npm test
```
Executes all 16 Vitest unit tests covering progress calculation edge cases (0 tasks, 100%, rounding) and Zod schema validations.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📡 REST API Specification

All endpoints return the standardized JSON contract:
- **Success**: `{ "data": <resource-or-array>, "error": null }`
- **Error**: `{ "data": null, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }`

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | No | Register new user account and establish session |
| `POST` | `/api/auth/signin` | No | Authenticate user credentials and return session |
| `POST` | `/api/auth/signout` | No | Terminate session and clear cookies |
| `GET` | `/api/me` | Yes | Get authenticated user profile |
| `GET` | `/api/projects` | Yes | List projects accessible to current user with summaries |
| `POST` | `/api/projects` | Yes | Create project (assigns creator as Owner) |
| `GET` | `/api/projects/:id` | Yes | Retrieve project details, member count, and progress |
| `PATCH` | `/api/projects/:id` | Yes | Update project name or description (Owner only) |
| `DELETE` | `/api/projects/:id` | Yes | Cascade delete project, its tasks, and memberships (Owner only) |
| `GET` | `/api/projects/:id/tasks` | Yes | List project tasks with optional status/priority/assignee filters |
| `POST` | `/api/projects/:id/tasks` | Yes | Create task within project with member verification |
| `GET` | `/api/tasks/:id` | Yes | Get full task details |
| `PATCH` | `/api/tasks/:id` | Yes | Update task fields (title, description, status, priority, due date, assignee) |
| `DELETE` | `/api/tasks/:id` | Yes | Delete task |
| `PATCH` | `/api/tasks/:id/status` | Yes | Dedicated endpoint to update task status (`TODO`, `IN_PROGRESS`, `DONE`) |
| `PATCH` | `/api/tasks/:id/assignee` | Yes | Dedicated endpoint to assign/reassign task to project member |
| `GET` | `/api/projects/:id/members` | Yes | List project collaborators with profile info |
| `POST` | `/api/projects/:id/members` | Yes | Invite collaborator by registered account email (Owner only) |
| `DELETE` | `/api/projects/:id/members/:userId` | Yes | Remove collaborator and safely unassign their tasks (Owner only) |

---

## 📊 Progress Calculation Formula

Project progress is calculated dynamically using task status data:
$$\text{Progress} = \text{round}\left(\frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100\right)$$
- If $\text{Total Tasks} = 0$, progress is $0\%$.
- Recalculates immediately upon any status toggle, task creation, or task deletion.

---

## 🌐 Deployment (Vercel + Supabase)

1. Push the code to a GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete NOVA project management platform"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. In the Vercel project settings, add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy! Vercel will automatically build and serve the application globally with preview deployments for pull requests.
