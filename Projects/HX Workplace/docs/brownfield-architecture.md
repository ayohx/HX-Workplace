# HX Workplace Brownfield Architecture Document

## Introduction

This document captures the **CURRENT STATE** of the HX Workplace codebase, including technical debt, workarounds, and real-world patterns. It serves as a reference for AI agents and developers working on the Facebook Workplace replacement enhancement.

### Document Scope

**Purpose**: Comprehensive documentation of entire system for production-readiness enhancement  
**Context**: Transforming prototype with mock data into production Facebook Workplace replacement  
**Audience**: AI development agents, Holiday Extras development team

### Change Log

| Date       | Version | Description                 | Author                   |
| ---------- | ------- | --------------------------- | ------------------------ |
| 2025-11-15 | 1.0     | Initial brownfield analysis | Mary (Business Analyst) |

---

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry**: `src/main.tsx` - React app initialization
- **App Component**: `src/App.tsx` - Routing configuration
- **Global Context**: `src/contexts/AppContext.tsx` - State management for entire app
- **Mock Data**: `src/data/mockData.ts` - All test data (to be replaced)
- **API Layer**: `src/lib/api.ts` - Mock API functions (to be replaced with Supabase)
- **Supabase Client**: `src/lib/supabase.ts` - Supabase initialization (partially configured)
- **Layout Wrapper**: `src/layouts/MainLayout.tsx` - Main app layout with navigation
- **Auth Layout**: `src/layouts/AuthLayout.tsx` - Login/Register page wrapper

### Component Library

- **Common Components**: `src/components/common/` - Avatar, CompanyLogo (reusable)
- **Feed Components**: `src/components/feed/` - PostCard, CreatePostCard, CommentList
- **Layout Components**: `src/components/layout/` - Header, Sidebar, MobileNav
- **User Components**: `src/components/user/` - UserMenu
- **Notifications**: `src/components/notifications/` - NotificationsDropdown

### Page Components

- **Dashboard**: `src/pages/Dashboard.tsx` - Main feed page
- **Groups**: `src/pages/GroupsPage.tsx`, `src/pages/GroupDetailPage.tsx`
- **Messages**: `src/pages/MessagesPage.tsx`
- **Profile**: `src/pages/ProfilePage.tsx`
- **Settings**: `src/pages/SettingsPage.tsx`
- **Search**: `src/pages/SearchPage.tsx`
- **Auth**: `src/pages/LoginPage.tsx`, `src/pages/RegisterPage.tsx`

---

## High Level Architecture

### Technical Summary

HX Workplace is a React-based single-page application (SPA) currently operating with mock data. The frontend is complete and functional, demonstrating all core features for a corporate social platform. Backend integration is pending a technology decision.

**Current Phase**: Frontend Prototype → Backend Technology Selection → Backend Integration

**Key Decision Points:**
- Backend platform selection (see Backend Options below)
- Hosting platform selection (see Hosting Options below)
- Database technology (PostgreSQL recommended across all options)

### Actual Tech Stack

| Category           | Technology                          | Version | Notes                                                                    |
| ------------------ | ----------------------------------- | ------- | ------------------------------------------------------------------------ |
| **Runtime**        | Node.js                             | 20.19.5 | Recently upgraded from v18 (November 2025)                               |
| **Package Manager**| npm                                 | 10.9.2  | Lock file present, no yarn/pnpm                                          |
| **Language**       | TypeScript                          | 5.5.3   | Strict mode enabled                                                      |
| **Framework**      | React                               | 18.3.1  | Functional components only, hooks-based                                  |
| **Build Tool**     | Vite                                | 5.4.2   | Fast HMR, optimized production builds                                    |
| **Routing**        | React Router                        | 6.22.3  | Client-side routing, protected routes implemented                        |
| **Styling**        | Tailwind CSS                        | 3.4.1   | Utility-first, custom design tokens                                      |
| **Forms**          | React Hook Form + Zod               | 7.51.0 + 3.22.4 | Form validation and schema validation                             |
| **Icons**          | Lucide React                        | 0.344.0 | Icon library                                                             |
| **State Mgmt**     | React Context API                   | (built-in) | Global state in AppContext                                            |
| **Backend**        | **TO BE DECIDED**                   | -       | See Backend Options section below                                        |
| **Database**       | **TO BE DECIDED**                   | -       | PostgreSQL recommended (all options support it)                         |
| **Deployment**     | **TO BE DECIDED**                   | -       | See Hosting Options section below                                        |
| **Linting**        | ESLint                              | 9.9.1   | React plugins, strict configuration                                      |

### Repository Structure Reality Check

- **Type**: Monorepo (single React app)
- **Package Manager**: npm
- **Notable**: 
  - BMad Method framework recently installed (`.bmad-core/`)
  - Some exploratory Supabase migrations exist in `supabase/` (not committed to any backend choice)
  - Mock data approach allows full frontend testing without backend dependency

---

## Backend Technology Options

### Decision Status: **PENDING**

The frontend is complete and functional. The next critical decision is selecting the backend technology stack. This section presents objective analysis of viable options.

### Option 1: Supabase (Backend-as-a-Service)

**What It Is**: PostgreSQL database with built-in authentication, real-time subscriptions, file storage, and REST/GraphQL APIs.

**Pros:**
- ✅ **Fastest time to production** (2-4 weeks) - Most backend features built-in
- ✅ **Real-time out of the box** - WebSocket subscriptions included
- ✅ **PostgreSQL underneath** - Can self-host or migrate data if needed (no true lock-in)
- ✅ **Excellent TypeScript support** - Auto-generated types from database schema
- ✅ **Row Level Security (RLS)** - Database-level access control
- ✅ **Generous free tier** - 50,000 monthly active users free
- ✅ **Mature ecosystem** - Well-documented, large community

**Cons:**
- ❌ **Less control over backend logic** - Limited to database triggers and edge functions
- ❌ **Vendor dependency** - Though PostgreSQL is portable, Supabase features are not
- ❌ **Learning curve for RLS** - Requires PostgreSQL knowledge for security policies

**Best For**: Speed to market, internal tools, when real-time is critical

**Cost Estimate (1000 users)**: £25/month (Pro plan) + £10-50/month bandwidth = **£35-75/month**

**Integration Effort**: 
- Replace `src/lib/api.ts` with Supabase client calls
- Implement RLS policies for data security
- Add real-time subscriptions to contexts

---

### Option 2: Firebase (Google Backend-as-a-Service)

**What It Is**: Google's BaaS with NoSQL database (Firestore), authentication, storage, and hosting.

**Pros:**
- ✅ **Google Cloud integration** - If already using Google Workspace
- ✅ **Real-time database** - Firestore has built-in real-time sync
- ✅ **Excellent mobile support** - Native SDKs for future mobile apps
- ✅ **Generous free tier** - 50K reads/20K writes per day free
- ✅ **Firebase Auth** - Battle-tested authentication system

**Cons:**
- ❌ **NoSQL data model** - Firestore requires different data modeling than PostgreSQL
- ❌ **Query limitations** - Less flexible queries than SQL databases
- ❌ **Google lock-in** - Harder to migrate than PostgreSQL-based solutions
- ❌ **Cost can escalate** - Pay per read/write operation

**Best For**: Google Cloud ecosystem integration, when NoSQL fits data model

**Cost Estimate (1000 users)**: £25/month (Blaze plan minimum) + operations = **£50-150/month**

**Integration Effort**:
- Redesign data model for Firestore (NoSQL collections vs SQL tables)
- Replace `src/lib/api.ts` with Firebase SDK calls
- Implement Firestore security rules

---

### Option 3: Custom Node.js Backend (Self-Hosted)

**What It Is**: Build custom REST API with Node.js + Express + PostgreSQL, self-hosted or cloud-deployed.

**Pros:**
- ✅ **Maximum control** - Full control over all backend logic
- ✅ **No vendor lock-in** - Pure open-source stack
- ✅ **PostgreSQL flexibility** - Full SQL power, no limitations
- ✅ **Custom business logic** - Complex workflows easier to implement
- ✅ **Technology familiarity** - Team likely knows Node.js/Express

**Cons:**
- ❌ **Longer development time** (6-8 weeks) - Build everything from scratch
- ❌ **More maintenance** - Responsible for infrastructure, security, scaling
- ❌ **Real-time complexity** - Must implement WebSocket server manually
- ❌ **More code to maintain** - Authentication, file storage, etc. all custom

**Best For**: Unique business logic, maximum control requirements, long-term in-house development

**Cost Estimate (1000 users)**: Railway/Render hosting £20/month + database £20/month = **£40-80/month**

**Integration Effort**:
- Build REST API endpoints for all features
- Implement authentication system (JWT tokens)
- Set up WebSocket server for real-time features
- Configure file storage (S3 or similar)
- Write all backend business logic

---

### Option 4: Next.js Full-Stack (React Server Components)

**What It Is**: Use Next.js 14+ App Router with React Server Components, PostgreSQL database, hosted on Vercel.

**Pros:**
- ✅ **Single codebase** - Frontend and backend in same Next.js project
- ✅ **React Server Components** - Server-side data fetching built into React
- ✅ **Vercel optimized** - Excellent developer experience on Vercel platform
- ✅ **TypeScript throughout** - End-to-end type safety
- ✅ **Modern approach** - Cutting-edge React patterns

**Cons:**
- ❌ **Major refactor required** - Must migrate from Vite to Next.js App Router
- ❌ **Learning curve** - React Server Components are new paradigm
- ❌ **Real-time more complex** - Still need separate WebSocket solution
- ❌ **Vercel vendor preference** - Works best on Vercel (though portable)

**Best For**: Modern React development, when starting fresh (less ideal for brownfield)

**Cost Estimate (1000 users)**: Vercel Pro £20/month + database £20/month = **£40-60/month**

**Integration Effort**:
- Migrate Vite project to Next.js 14 App Router
- Convert React Router to Next.js routing
- Implement Server Actions for data mutations
- Add database client (Prisma or Drizzle recommended)

---

### Backend Options Comparison Matrix

| Criteria | Supabase | Firebase | Custom Node.js | Next.js Full-Stack |
|----------|----------|----------|----------------|-------------------|
| **Time to Production** | 🟢 2-4 weeks | 🟡 3-5 weeks | 🔴 6-8 weeks | 🔴 6-8 weeks |
| **Cost (1000 users)** | 🟢 £35-75/mo | 🟡 £50-150/mo | 🟢 £40-80/mo | 🟢 £40-60/mo |
| **Real-Time Features** | 🟢 Built-in | 🟢 Built-in | 🔴 Custom build | 🔴 Custom build |
| **Backend Control** | 🟡 Limited | 🟡 Limited | 🟢 Full | 🟢 Full |
| **SQL Flexibility** | 🟢 PostgreSQL | 🔴 NoSQL only | 🟢 PostgreSQL | 🟢 PostgreSQL |
| **Vendor Lock-In Risk** | 🟡 Medium | 🔴 High | 🟢 None | 🟡 Medium |
| **Maintenance Burden** | 🟢 Low | 🟢 Low | 🔴 High | 🟡 Medium |
| **Migration from Current** | 🟢 Easy | 🟡 Medium | 🟡 Medium | 🔴 Hard |
| **Brownfield Suitability** | 🟢 Excellent | 🟡 Good | 🟡 Good | 🔴 Poor |

**Legend**: 🟢 Best | 🟡 Acceptable | 🔴 Challenging

---

### Recommended Approach Based on Priorities

**If Priority = Speed to Market:**
→ **Supabase** (Production in 2-4 weeks, minimal risk)

**If Priority = Maximum Control:**
→ **Custom Node.js** (Full control, longer development, more maintenance)

**If Priority = Google Ecosystem:**
→ **Firebase** (Best Google Cloud integration, NoSQL trade-off)

**If Priority = Modern React + Refactor Appetite:**
→ **Next.js Full-Stack** (Cutting-edge, but significant refactor required)

---

## Hosting Platform Options

### Decision Status: **PENDING**

Once backend technology is chosen, we need to select a hosting platform. Key factors: deployment ease, performance, cost, and backend compatibility.

### Option 1: Vercel (Recommended for Next.js/Modern React)

**What It Is**: Frontend-focused platform with edge functions, excellent Next.js integration.

**Pros:**
- ✅ **Best React/Next.js experience** - Built by Next.js creators
- ✅ **Edge network** - Global CDN with edge functions
- ✅ **Excellent DX** - Git-based deployments, preview environments
- ✅ **Zero-config** - Works out of the box for React/Next.js

**Cons:**
- ❌ **More expensive at scale** - Bandwidth costs add up
- ❌ **Vendor preference for Next.js** - Less optimized for non-Next.js projects

**Best For**: Next.js projects, modern React apps, when DX is priority

**Cost**: Free tier generous (100GB bandwidth), Pro £20/month for teams

**Backend Compatibility**: ⭐⭐⭐⭐ Excellent (all options work, especially Next.js)

---

### Option 2: Netlify (Originally Configured)

**What It Is**: JAMstack-focused platform with forms, functions, and easy Git deployments.

**Pros:**
- ✅ **Already configured** - `netlify.toml` exists in project
- ✅ **Great for SPAs** - Excellent React/Vite support
- ✅ **Generous free tier** - 100GB bandwidth, 125K function invocations
- ✅ **Simple deploys** - Git push to deploy

**Cons:**
- ❌ **Function limitations** - 10-second timeout on free tier
- ❌ **Less performant than Vercel** - Slower builds, edge network smaller

**Best For**: Static sites, JAMstack apps, current Vite setup

**Cost**: Free tier sufficient initially, Pro £19/month for teams

**Backend Compatibility**: ⭐⭐⭐ Good (works with Supabase, Firebase; custom backends limited)

---

### Option 3: Railway (Recommended for Custom Backend)

**What It Is**: Developer-focused platform for full-stack apps with databases, excellent for custom backends.

**Pros:**
- ✅ **Database included** - PostgreSQL, MySQL, Redis, MongoDB built-in
- ✅ **Great for custom backends** - Node.js, Python, Go, etc. support
- ✅ **Simple pricing** - Pay for resources used, no surprise costs
- ✅ **Excellent DX** - GitHub integration, automatic HTTPS

**Cons:**
- ❌ **Less frontend-optimized** - Not as fast for static assets as Vercel/Netlify
- ❌ **Smaller edge network** - No global edge functions

**Best For**: Custom Node.js backends, when you need database + backend + frontend

**Cost**: ~£5/month free credit, typical app £20-40/month

**Backend Compatibility**: ⭐⭐⭐⭐⭐ Excellent (perfect for custom backends + database)

---

### Option 4: Render (Alternative to Railway)

**What It Is**: Similar to Railway, supports databases and custom backends with free tier.

**Pros:**
- ✅ **Generous free tier** - Free PostgreSQL database, free static sites
- ✅ **Simple pricing** - Transparent, predictable costs
- ✅ **Good documentation** - Easy to understand

**Cons:**
- ❌ **Free tier sleeps** - Apps sleep after 15 min inactivity (startup delay)
- ❌ **Less performant free tier** - Slower than Railway/Railway free options

**Best For**: Testing/prototyping, budget-conscious projects

**Cost**: Free tier available, paid plans from £7/month

**Backend Compatibility**: ⭐⭐⭐⭐ Excellent (custom backends work well)

---

### Option 5: AWS/Azure/GCP (Enterprise Options)

**What It Is**: Major cloud providers with full infrastructure control.

**Pros:**
- ✅ **Maximum flexibility** - Every cloud service available
- ✅ **Enterprise features** - Compliance, security, SLAs
- ✅ **Existing corporate accounts** - May already have Holiday Extras agreements

**Cons:**
- ❌ **Complexity** - Requires DevOps expertise
- ❌ **More expensive** - Pay for infrastructure and management overhead
- ❌ **Slower deployments** - More configuration required

**Best For**: Enterprise requirements, existing cloud commitments, large scale

**Cost**: Variable, typically £100+ /month with management overhead

**Backend Compatibility**: ⭐⭐⭐⭐⭐ Universal (anything can run here)

---

### Hosting Platform Comparison Matrix

| Criteria | Vercel | Netlify | Railway | Render | AWS/Azure/GCP |
|----------|---------|---------|---------|---------|---------------|
| **React/Vite Support** | 🟢 Excellent | 🟢 Excellent | 🟡 Good | 🟡 Good | 🟡 Manual setup |
| **Custom Backend** | 🟡 Edge Fns | 🟡 Functions | 🟢 Native | 🟢 Native | 🟢 Full control |
| **Database Hosting** | 🔴 Separate | 🔴 Separate | 🟢 Included | 🟢 Included | 🟢 Included |
| **Cost (1000 users)** | 🟡 £20-60/mo | 🟢 £19-40/mo | 🟢 £20-40/mo | 🟢 £7-30/mo | 🔴 £100+/mo |
| **Deployment Ease** | 🟢 Excellent | 🟢 Excellent | 🟢 Excellent | 🟡 Good | 🔴 Complex |
| **Performance** | 🟢 Best | 🟡 Good | 🟡 Good | 🟡 Good | 🟢 Configurable |
| **Free Tier** | 🟢 Generous | 🟢 Generous | 🟡 Limited | 🟢 Very generous | 🔴 Trial only |

---

### Recommended Hosting by Backend Choice

| Backend Choice | Recommended Host | Why |
|----------------|------------------|-----|
| **Supabase** | Vercel or Netlify | Frontend-only hosting, Supabase handles backend |
| **Firebase** | Vercel or Firebase Hosting | Firebase Hosting integrated, but Vercel better DX |
| **Custom Node.js** | Railway or Render | Need backend + database hosting together |
| **Next.js** | Vercel (strongly) | Built for Next.js, best performance |

---

### Decision Framework for Your Bosses

**Present these questions to guide the decision:**

1. **Timeline Priority**: How fast do you need production-ready?
   - Urgent (4 weeks): Supabase + Vercel/Netlify
   - Moderate (6-8 weeks): Custom Node.js + Railway
   - Flexible: Evaluate all options

2. **Control vs Speed Trade-off**: Maximum control or minimum time?
   - Speed matters most: Supabase
   - Control matters most: Custom Node.js

3. **Budget Considerations**: Initial budget constraints?
   - Tight budget: Firebase or Render (free tiers)
   - Moderate: Supabase + Netlify (£50-100/mo)
   - Flexible: Any option works

4. **Technical Debt Tolerance**: Comfortable with vendor dependency?
   - Low tolerance: Custom Node.js (full ownership)
   - Moderate: Supabase (PostgreSQL portability)
   - High tolerance: Firebase (but harder migration)

5. **Future Mobile Apps**: Native mobile apps planned?
   - Yes, priority: Firebase (excellent mobile SDKs)
   - Maybe later: Any option (all support mobile)
   - Web-only: Supabase or Custom Node.js

---

## Source Tree and Module Organisation

### Project Structure (Actual)

```text
HX Workplace/
├── .bmad-core/                   # BMad Method framework (recently added)
│   ├── agents/                   # AI agent definitions
│   ├── tasks/                    # Reusable task workflows
│   ├── templates/                # Document templates
│   └── core-config.yaml          # BMad configuration
├── .cursor/                      # Cursor IDE configuration
│   ├── rules/bmad/               # Agent persona files
│   └── settings.json             # Editor settings
├── docs/                         # Project documentation
│   ├── prd.md                    # Product Requirements Document (newly created)
│   └── brownfield-architecture.md # This document
├── public/                       # Static assets
│   └── palmtree.svg              # Company logo
├── src/                          # Source code (React app)
│   ├── components/               # React components
│   │   ├── common/               # Reusable components (Avatar, Logo)
│   │   ├── feed/                 # Feed-related components
│   │   ├── layout/               # Navigation components
│   │   ├── notifications/        # Notification components
│   │   └── user/                 # User-related components
│   ├── contexts/                 # React Context providers
│   │   └── AppContext.tsx        # Global application state
│   ├── data/                     # Mock data (TEMPORARY - to be replaced)
│   │   └── mockData.ts           # All test data (users, posts, groups, messages)
│   ├── layouts/                  # Page layout wrappers
│   │   ├── AuthLayout.tsx        # Login/Register layout
│   │   └── MainLayout.tsx        # Main app layout with navigation
│   ├── lib/                      # Libraries and utilities
│   │   ├── api.ts                # Mock API functions (to be replaced with backend client)
│   │   └── supabase.ts           # Backend client placeholder (exploratory Supabase setup)
│   ├── pages/                    # Route components
│   │   ├── Dashboard.tsx         # Main feed page
│   │   ├── GroupsPage.tsx        # Groups list
│   │   ├── GroupDetailPage.tsx   # Individual group view
│   │   ├── LoginPage.tsx         # Authentication
│   │   ├── MessagesPage.tsx      # Direct messaging
│   │   ├── ProfilePage.tsx       # User profiles
│   │   ├── SearchPage.tsx        # Global search
│   │   └── SettingsPage.tsx      # User settings
│   ├── utils/                    # Helper functions
│   │   └── dateUtils.ts          # Date formatting utilities
│   ├── App.tsx                   # Main app component with routing
│   ├── main.tsx                  # React app entry point
│   └── index.css                 # Global styles (Tailwind imports)
├── supabase/                     # Supabase configuration
│   └── migrations/               # Database migration files
│       ├── 20250602123728_misty_torch.sql
│       ├── 20250603082055_wild_marsh.sql
│       ├── 20250604084331_quiet_lake.sql
│       ├── 20250604090919_fierce_cave.sql
│       └── 20250604092042_black_fountain.sql  # Latest: updated_at column
├── .env.local (gitignored)       # Local environment variables
├── .gitignore                    # Git ignore rules
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML template
├── netlify.toml                  # Netlify deployment config
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── README.md                     # Project documentation
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration (base)
├── tsconfig.app.json             # TypeScript configuration (app)
├── tsconfig.node.json            # TypeScript configuration (Vite)
└── vite.config.ts                # Vite build configuration
```

### Key Modules and Their Purpose

**State Management:**
- **`src/contexts/AppContext.tsx`**: Global application state using React Context API
  - Manages authentication state (currentUser, isAuthenticated)
  - Stores users, posts, groups, messages, notifications (currently from mock data)
  - Provides CRUD operations for posts, comments, likes, notifications
  - **NOTE**: Currently uses in-memory state; will need real-time sync with chosen backend

**Data Layer:**
- **`src/data/mockData.ts`**: Mock data for development (TEMPORARY)
  - Contains: mockUsers (5 test users), mockPosts, mockGroups, mockMessages
  - **CRITICAL**: All functions currently read/write to this mock data
  - **TO BE REPLACED**: With backend database queries (Supabase, Firebase, or custom API)

**API Layer:**
- **`src/lib/api.ts`**: API abstraction layer (currently mocked)
  - Functions: login, register, logout, updateProfile, createPost
  - Simulates 500ms delay to mimic network latency
  - **CRITICAL**: All API functions need replacement with backend client calls
  - **Pattern**: Functions return promises, already async-ready
  - **FLEXIBILITY**: Abstraction layer allows easy swapping of backend implementations

**Backend Client Placeholder:**
- **`src/lib/supabase.ts`**: Exploratory backend client (Supabase)
  - Contains experimental Supabase client initialization
  - Environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
  - **STATUS**: Exploratory only - not committed to this backend choice
  - **NOTE**: Will be replaced/renamed based on final backend decision (e.g., `firebase.ts`, `api-client.ts`)

**Component Patterns:**
- **Feed Components**: PostCard, CreatePostCard, CommentList
  - Consume data from AppContext
  - Handle user interactions (like, comment, share)
  - **Pattern**: Functional components with hooks, props interfaces

**Layout Components:**
- **Header**: Navigation bar with notifications, search, user menu
- **Sidebar**: Main navigation for desktop
- **MobileNav**: Bottom navigation for mobile devices
- **Pattern**: Responsive design with Tailwind breakpoints

**Page Components:**
- **Dashboard**: Main feed with post creation
- **Profile**: User profile view and editing
- **Groups**: Group list and individual group detail
- **Messages**: Conversation list and message threads
- **Settings**: User preferences and account settings
- **Pattern**: React Router v6, protected routes via MainLayout

---

## Data Models and APIs

### Data Models

**User Model** (see `src/contexts/AppContext.tsx` lines 5-39)
```typescript
interface User {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  role: string;
  department: string;
  email?: string;
  bio?: string;
  location?: string;
  phone?: string;
  linkedin?: string;
  managerId?: string | null;
  directReports?: string[];
  settings?: {
    notifications: { email, push, mentions, comments, likes };
    privacy: { profileVisibility, showEmail, showPhone, allowMessages };
    preferences: { theme, language, timezone };
  };
}
```

**Post Model** (see `src/contexts/AppContext.tsx` lines 55-63)
```typescript
interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: string[];  // Array of user IDs
  comments: Comment[];
  attachments?: Attachment[];
}
```

**Comment Model** (see `src/contexts/AppContext.tsx` lines 41-46)
```typescript
interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}
```

**Group Model** (see `src/contexts/AppContext.tsx` lines 65-72)
```typescript
interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  posts: string[];
  isPrivate: boolean;
}
```

**Message Model** (see `src/contexts/AppContext.tsx` lines 74-81)
```typescript
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
```

**Notification Model** (see `src/contexts/AppContext.tsx` lines 83-90)
```typescript
interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  timestamp: string;
  read: boolean;
}
```

### API Specifications

**Current API Functions** (see `src/lib/api.ts`)

1. **`login(email: string, password: string)`**
   - **Current Implementation**: Searches mockUsers array, validates credentials
   - **Returns**: `{ user: User }`
   - **Errors**: Throws "Invalid login credentials"
   - **TO REPLACE**: With backend authentication system (e.g., Supabase Auth, Firebase Auth, JWT custom)

2. **`register(userData: RegisterData)`**
   - **Current Implementation**: Creates new user object with random ID
   - **Returns**: `{ user: User }`
   - **TO REPLACE**: With backend user creation and authentication setup

3. **`logout()`**
   - **Current Implementation**: Simulates 500ms delay
   - **TO REPLACE**: With backend session termination

4. **`updateProfile(userId: string, updates: any)`**
   - **Current Implementation**: Updates mockUsers array
   - **Returns**: `{ success: true, updates }`
   - **TO REPLACE**: With database profile update query

5. **`createPost(postData: any)`**
   - **Current Implementation**: Creates post with random ID, current timestamp
   - **Returns**: `{ post: Post }`
   - **TO REPLACE**: With database insert operation

**Database Schema Exploration** (see `supabase/migrations/`)

Exploratory migrations exist in `supabase/` folder:
- These represent initial database schema exploration (PostgreSQL)
- Can be adapted for any PostgreSQL backend (Supabase, Railway, custom)
- Alternatively, can be converted to Firestore schema if Firebase chosen
- **NOTE**: Schema design is backend-agnostic; migrations will be finalized after backend decision

---

## Technical Debt and Known Issues

### Critical Technical Debt

1. **Mock Data Dependency - ENTIRE APPLICATION**
   - **Location**: `src/data/mockData.ts`, `src/lib/api.ts`, `src/contexts/AppContext.tsx`
   - **Issue**: Entire application operates on mock data with no backend persistence
   - **Impact**: Cannot go to production, no real-time collaboration, data lost on refresh
   - **Complexity**: High - Requires systematic replacement of all API calls
   - **Priority**: P0 - Blocking production deployment

2. **Backend Technology Decision Pending**
   - **Location**: Overall architecture
   - **Issue**: Backend platform not yet selected (see Backend Options section above)
   - **Impact**: Cannot proceed with production integration until decision made
   - **Complexity**: Low - Decision needed, then integration begins
   - **Priority**: P0 - Blocking all backend work

3. **No Authentication Persistence**
   - **Location**: `src/contexts/AppContext.tsx` (currentUser state)
   - **Issue**: Authentication state lost on page refresh (no session storage)
   - **Impact**: Poor user experience, constant re-login required
   - **Complexity**: Low - Add localStorage or backend session management
   - **Priority**: P1 - Important UX improvement

4. **No Real-Time Capabilities**
   - **Issue**: No WebSocket or real-time subscriptions implemented
   - **Impact**: Users don't see updates without manual refresh (posts, messages, notifications)
   - **Complexity**: Varies by backend choice (built-in for Supabase/Firebase, custom for Node.js)
   - **Priority**: P1 - Key Facebook Workplace feature

5. **Missing File Upload Implementation**
   - **Location**: Post attachments referenced in UI but no actual upload
   - **Issue**: File attachments displayed but no upload functionality implemented
   - **Impact**: Cannot share images/documents as shown in designs
   - **Complexity**: Varies by backend choice (built-in storage for Supabase/Firebase, S3 for custom)
   - **Priority**: P1 - Core feature for collaboration

6. **No Testing Strategy**
   - **Issue**: No unit tests, integration tests, or E2E tests present
   - **Impact**: Risk of regressions when adding backend, hard to verify functionality
   - **Complexity**: High - Requires test setup, strategy, and comprehensive coverage
   - **Priority**: P2 - Important for maintainability

7. **Type Safety Gaps**
   - **Location**: Various components using `any` type
   - **Example**: `src/lib/api.ts` line 17: `register(userData: any)`
   - **Impact**: Reduced TypeScript benefits, potential runtime errors
   - **Complexity**: Low - Define proper TypeScript interfaces
   - **Priority**: P2 - Code quality improvement

### Workarounds and Gotchas

**Environment Variables:**
- **Gotcha**: Vite requires `VITE_` prefix for environment variables exposed to client
- **Workaround**: All Supabase config uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Critical**: Never commit `.env.local` file (contains secrets)

**Mock Data Modification:**
- **Gotcha**: Changes to mock data persist in memory only during session
- **Workaround**: Refresh page to reset all data (useful for testing)
- **Critical**: Do not rely on mock data for important testing - will be replaced

**Protected Routes:**
- **Gotcha**: Authentication check happens in MainLayout, not individual pages
- **Pattern**: All pages wrapped in MainLayout are automatically protected
- **Note**: Login/Register use AuthLayout (no auth check)

**Tailwind CSS Custom Classes:**
- **Gotcha**: Custom design tokens defined in `tailwind.config.js`
- **Pattern**: Use `shadow-card`, `text-neutral-800`, `bg-primary-600` (custom)
- **Warning**: These custom classes won't autocomplete in IDE, refer to config file

**React Router v6 Changes:**
- **Gotcha**: v6 syntax different from v5 (no Switch, Route children change)
- **Pattern**: Routes defined in `src/App.tsx` using `<Routes>` and `<Route element={...}>`
- **Note**: Protected routes use `element={<MainLayout><Page /></MainLayout>}` pattern

---

## Integration Points and External Dependencies

### External Services

| Service Type     | Purpose                     | Status            | Notes                       |
| ---------------- | --------------------------- | ----------------- | --------------------------- |
| **Backend (TBD)** | Backend-as-a-Service or Custom API | **Decision Pending** | See Backend Options section |
| **Database (TBD)** | Data persistence           | **Decision Pending** | PostgreSQL recommended; exploratory migrations in `supabase/` |
| **Authentication** | User authentication/authorization | **Decision Pending** | Options: Supabase Auth, Firebase Auth, JWT custom |
| **File Storage** | User uploads, attachments  | **Not Implemented** | Options: Supabase Storage, Firebase Storage, S3 |
| **Real-time Sync** | Live updates, notifications | **Not Implemented** | Options: Supabase Realtime, Firebase, Socket.io |
| **Hosting (TBD)** | Frontend deployment        | **Decision Pending** | See Hosting Options section; `netlify.toml` exists (exploratory) |
| Pexels         | Stock images (mock data)    | Temporary         | `src/data/mockData.ts` - will be replaced

### Internal Integration Points

**Component Communication:**
- **Pattern**: Props-based for parent-child, Context API for global state
- **AppContext**: Provides state and functions to entire component tree
- **Example**: PostCard receives post data via props, uses context for like/comment actions

**Routing and Navigation:**
- **Pattern**: React Router v6 with client-side routing
- **Links**: Use `<Link to="/path">` from react-router-dom (not `<a href>`)
- **Protected Routes**: MainLayout checks `isAuthenticated` from AppContext
- **Redirect**: Login page redirects to `/` (dashboard) after successful auth

**State Updates:**
- **Pattern**: Context provides functions for state updates (addPost, toggleLike, etc.)
- **Flow**: Component → Context function → State update → Re-render
- **Optimistic UI**: Some actions update UI immediately (like/unlike, new post)

---

## Development and Deployment

### Local Development Setup

**Actual Steps That Work:**

1. **Prerequisites**: Node.js v20+ (recently upgraded from v18)

2. **Clone and Install**:
   ```bash
   cd "HX Workplace"
   npm install
   ```

3. **Environment Variables** (create `.env.local`):
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   **Note**: Currently optional (mock data works without), will be required for backend integration

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173` (Vite default port)

5. **Test Login**:
   Use any test user from README.md:
   - Email: `john.smith@company.com`
   - Password: `password123`

**Known Issues with Setup:**

- **No setup issues currently** - Frontend works perfectly with mock data
- **Future setup requirement**: Supabase project and credentials for backend integration

### Build and Deployment Process

**Build Command**:
```bash
npm run build
```
- **Output**: `dist/` folder (git ignored)
- **Process**: Vite builds optimized production bundle (TypeScript → JavaScript, Tailwind → CSS)
- **Type Checking**: TypeScript compiler runs during build
- **Linting**: ESLint runs to catch code quality issues

**Deployment**:
- **Platform**: Netlify (configured in `netlify.toml`)
- **Trigger**: Git push to main/master branch (continuous deployment)
- **Environment Variables**: Set in Netlify dashboard (Supabase credentials)
- **Functions**: Netlify Functions available for serverless API endpoints (not currently used)

**Preview Deploys**:
- **Trigger**: Pull requests automatically get preview URL
- **Purpose**: Test changes before merging to production

**Rollback**:
- **Method**: Netlify dashboard allows instant rollback to previous deployment
- **Use Case**: If production deployment has critical issues

---

## Testing Reality

### Current Test Coverage

- **Unit Tests**: 0% - No tests exist
- **Integration Tests**: 0% - No tests exist
- **E2E Tests**: 0% - No tests exist
- **Manual Testing**: 100% - Primary QA method

### Testing Strategy (Recommended for Future)

**Unit Testing (Recommended: Jest + React Testing Library)**:
- Test individual components in isolation
- Mock AppContext for component tests
- Test utility functions (`dateUtils.ts`)
- Target: 80% coverage for components and utilities

**Integration Testing (Recommended: React Testing Library + MSW)**:
- Test component interactions with context
- Mock API calls with Mock Service Worker (MSW)
- Test authentication flows end-to-end
- Test post creation, commenting, like flows

**E2E Testing (Recommended: Playwright or Cypress)**:
- Test critical user journeys (login → post → comment)
- Test across different browsers
- Test mobile-responsive design
- Run in CI/CD pipeline before deployment

### Running Tests (Future)

```bash
# Unit tests (when implemented)
npm test

# E2E tests (when implemented)
npm run test:e2e

# Coverage report (when implemented)
npm run test:coverage
```

---

## British English Compliance

**CRITICAL**: All user-facing text must use British English spelling and terminology.

**Examples in Codebase:**
- ✅ "organisation" (not "organization")
- ✅ "colour" (not "color")
- ✅ "favourite" (not "favorite")
- ✅ "specialise" (not "specialize")

**Enforcement:**
- Manual review during code review
- Future: Consider ESLint plugin for British English

---

## Mobile Responsiveness

### Current Implementation

**Breakpoints** (Tailwind CSS default):
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

**Responsive Patterns:**
- **Header**: Hamburger menu for mobile, full menu for desktop
- **Sidebar**: Hidden on mobile, shown on desktop
- **MobileNav**: Bottom navigation bar (mobile only)
- **PostCard**: Stacks vertically on mobile, optimized spacing
- **Forms**: Full-width on mobile, constrained on desktop

**Touch-Friendly:**
- Button sizes adequate for touch (44px minimum)
- Spacing between interactive elements sufficient
- No hover-dependent interactions (fallbacks provided)

**Performance:**
- Lazy loading images (not yet implemented, recommended)
- Responsive images with `srcset` (not yet implemented, recommended)

---

## Performance Considerations

### Current Performance Characteristics

**Strengths:**
- Vite provides fast hot module replacement (HMR) during development
- React 18 concurrent rendering improves responsiveness
- Tailwind CSS purges unused styles in production (small CSS bundle)
- Client-side routing avoids full page reloads

**Weaknesses:**
- No code splitting (entire app loaded at once)
- No lazy loading for routes or components
- No image optimization (using external URLs from Pexels)
- No caching strategy (service workers, HTTP caching)
- Mock data simulates 500ms delay (real API may be faster or slower)

**Recommendations for Production:**
- Implement React.lazy() for route-based code splitting
- Add react-query for API caching and state management
- Optimize images (compression, responsive images, lazy loading)
- Add service worker for offline support and caching
- Monitor bundle size (currently unknown, needs Vite bundle analyzer)

---

## Security Considerations

### Current Security State

**Implemented:**
- TypeScript provides type safety (reduces runtime errors)
- ESLint catches common code issues
- Passwords in mock data (temporary, to be hashed in database)

**Missing (Required for Production):**
- No HTTPS enforcement (rely on Netlify for SSL)
- No input sanitization (XSS vulnerability risk)
- No rate limiting on API calls
- No content security policy (CSP)
- No authentication token storage (no tokens yet)
- No secure password hashing (mock data uses plain text)
- No audit logging
- No role-based access control (RBAC)

**Critical Security Tasks for Backend Integration:**
- Implement Supabase Row Level Security (RLS) policies
- Hash passwords with bcrypt/Argon2 (Supabase Auth handles this)
- Store JWT tokens securely (Supabase SDK handles this)
- Sanitize user input before saving to database
- Add Content Security Policy headers
- Implement rate limiting for auth endpoints
- Add CSRF protection for forms
- Enable audit logging for admin actions

---

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
# Development
npm run dev         # Start Vite dev server at http://localhost:5173

# Building
npm run build       # Production build → dist/ folder
npm run preview     # Preview production build locally

# Code Quality
npm run lint        # Run ESLint on all source files

# BMad Method (recently added)
npm run bmad:refresh  # Refresh BMad agent definitions
npm run bmad:list     # List all available BMad agents
npm run bmad:validate # Validate BMad configuration
```

### Debugging and Troubleshooting

**React DevTools**:
- Install React DevTools browser extension
- Inspect component props and state
- Track component re-renders

**Vite DevTools**:
- Open browser DevTools console
- Check Network tab for API calls (will show 500ms mock delays)
- Use React DevTools for component inspection

**Common Issues**:
- **Blank page on refresh**: Check if currentUser persists (currently doesn't - known issue)
- **Changes not showing**: Vite HMR sometimes fails, refresh page
- **TypeScript errors**: Run `npm run build` to catch all type errors
- **ESLint errors**: Run `npm run lint` to see all code quality issues

---

## Backend Integration Impact Analysis

After backend technology selection, these are the areas that will require modification:

### Files That Will Need Major Modification

1. **`src/lib/api.ts`** - Replace all mock API functions with backend client calls
   - Supabase: Supabase client methods
   - Firebase: Firebase SDK calls
   - Custom API: Fetch/Axios HTTP requests
2. **`src/contexts/AppContext.tsx`** - Add real-time subscriptions and state synchronization
   - Backend-specific: Real-time library integration (Supabase Realtime, Firebase Firestore, Socket.io)
3. **`src/lib/supabase.ts`** - **RENAME/REPLACE** with backend client
   - Supabase: Keep as `supabase.ts`, expand with helpers
   - Firebase: Rename to `firebase.ts` with Firebase config
   - Custom API: Rename to `api-client.ts` with HTTP client setup
4. **`src/data/mockData.ts`** - **DELETE** after backend migration complete

### New Files/Modules Needed (Backend-Specific)

**Option A: Supabase Backend**
- `src/lib/supabase/` directory with:
  - `posts.ts`, `auth.ts`, `storage.ts`, `realtime.ts` helpers
  - TypeScript types from Supabase CLI auto-generation

**Option B: Firebase Backend**
- `src/lib/firebase/` directory with:
  - `firestore.ts`, `auth.ts`, `storage.ts` helpers
  - Firestore security rules in `firestore.rules`

**Option C: Custom Node.js Backend**
- `src/lib/api-client.ts` - HTTP client configuration
- `src/types/api.types.ts` - API request/response types
- Backend repository: Separate Node.js/Express API project

**All Options:**
- `src/hooks/` - Custom React hooks for data fetching (consider React Query)
- `src/types/` - TypeScript types for domain models
- `src/**/*.test.tsx` - Tests for all components and utilities

### Integration Considerations

**Universal (All Backend Options):**
- **Gradual Migration**: Implement feature-by-feature (auth → posts → comments → messages)
- **Feature Flags**: Use environment variables to toggle between mock and real backend
- **Parallel Testing**: Keep mock data temporarily for comparison during migration
- **State Management**: Consider upgrading from Context API to React Query for better caching
- **Error Handling**: Mock API has minimal error handling - add comprehensive error management

**Backend-Specific:**
- **Supabase**: Real-time subscriptions need cleanup (useEffect return); Row Level Security policies required
- **Firebase**: Firestore security rules must be written; NoSQL data modeling adjustments needed
- **Custom API**: WebSocket server needed for real-time; JWT authentication implementation required; File upload to S3 or similar storage

---

**End of Brownfield Architecture Document**

---

## Notes for AI Agents

**Critical Patterns to Follow:**
1. **TypeScript Strict Mode**: Always provide proper types, avoid `any`
2. **Functional Components**: Use hooks (useState, useEffect, useContext), no class components
3. **Tailwind CSS**: Use utility classes, avoid custom CSS except when absolutely necessary
4. **British English**: All user-facing text must use British spelling
5. **React Router v6**: Use `<Link>` and `<Routes>` patterns, not v5 syntax
6. **Context Pattern**: Global state in AppContext, component-local state in useState
7. **Async/Await**: All API calls use async/await, not callbacks or raw promises
8. **Error Handling**: Use try/catch blocks, provide user-friendly error messages

**DO NOT:**
- Modify mock data structure without updating TypeScript interfaces
- Create custom CSS classes (use Tailwind utilities)
- Use American English spelling
- Implement backend logic in frontend (keep API layer abstract)
- Break existing component APIs (maintain backwards compatibility)
- Remove existing functionality (enhancement only, no deletions)

**Priority for Backend Integration (After Technology Selection):**
1. Authentication (login/register/logout with chosen auth system)
2. Posts (create/read/update/delete with database)
3. Comments and Likes (user interactions)
4. Real-Time Updates (WebSocket/subscription system)
5. File Uploads (storage system: Supabase Storage, Firebase Storage, or S3)
6. Messages (direct and group chat)
7. Notifications (real-time delivery)
8. User Profiles (edit and view)
9. Groups (creation and management)
10. Search (full-text search in chosen database)

