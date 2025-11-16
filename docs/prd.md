# HX Workplace - Facebook Workplace Replacement PRD

## Intro Project Analysis and Context

### Existing Project Overview

#### Analysis Source
- **Type**: IDE-based fresh analysis
- **Date**: November 15, 2025
- **Analyst**: Mary (Business Analyst)

#### Current Project State

**HX Workplace** is an internal corporate social networking and collaboration platform built for Holiday Extras. It serves as a workplace hub enabling ~1,000 employees to connect, share updates, join interest groups, and communicate within the organisation.

**Current Technology Stack:**
- **Frontend**: React 18.3 with TypeScript, Vite, React Router v6, Tailwind CSS
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Backend**: **DECISION PENDING** (see Technical Constraints section)
- **Deployment**: **DECISION PENDING** (see Technical Constraints section)
- **Development Status**: Frontend complete with mock data, awaiting backend technology selection

**Current Features Implemented:**
- ✅ Authentication system (login/registration with protected routes)
- ✅ Social feed (create posts, like, comment, share updates with attachments)
- ✅ Groups/Communities (public and private groups for team collaboration)
- ✅ Messaging system (direct messages with read/unread status)
- ✅ User profiles (comprehensive profiles with organisational hierarchy)
- ✅ Notifications (real-time notification system with read/unread tracking)
- ✅ Search (find users, posts, and groups)
- ✅ Settings (customisable notification, privacy, and preference settings)

### Available Documentation Analysis

#### Available Documentation
- ✅ README.md - Project overview, tech stack, setup instructions
- ✅ Package.json - Dependencies and scripts documented
- ✅ TypeScript - Type definitions in place
- ⏳ Supabase migrations - Database schema partially defined
- ❌ API Documentation - Not yet formalised
- ❌ Component Library Documentation
- ❌ Coding Standards - Implicit from codebase
- ❌ Testing Strategy
- ❌ UX/UI Guidelines

**Recommendation**: After this PRD, we should run the `document-project` task to create comprehensive brownfield architecture documentation.

### Enhancement Scope Definition

#### Enhancement Type
- ✅ **New Feature Addition** - Missing Facebook Workplace features
- ✅ **Major Feature Modification** - Enhance existing features to match Facebook Workplace
- ✅ **Integration with New Systems** - Complete Supabase integration
- ✅ **UI/UX Overhaul** - Ensure highest quality mobile-responsive design
- ⚠️ **Technology Stack Upgrade** - Backend decision (Supabase vs alternatives)

#### Enhancement Description

Transform HX Workplace from a prototype with mock data into a production-ready Facebook Workplace replacement for Holiday Extras' ~1,000 employees. This enhancement will complete the backend integration, add missing Facebook Workplace feature parity, ensure exceptional mobile-responsive UX/UI, and design the system to support potential future data migration from Facebook Workplace (though immediate migration is not required).

#### Impact Assessment
- ✅ **Significant Impact** - Substantial existing code changes required
  - Complete backend integration (replacing mock data)
  - Add missing feature parity with Facebook Workplace
  - Enhance mobile responsiveness to highest UX/UI standards
  - Data architecture designed for future migration capability

### Goals and Background Context

#### Goals

- **Primary**: Replace Facebook Workplace as Holiday Extras' internal collaboration platform before its sunset
- **Employee Engagement**: Maintain/improve current levels of employee connection and interaction
- **Knowledge Sharing**: Enable effective information sharing across all departments (~1,000 colleagues)
- **Team Collaboration**: Support public and private group collaboration similar to Facebook Workplace
- **Seamless Migration**: Achieve feature adoption as close to Facebook Workplace as possible
- **Future-Proof**: Design system architecture to support potential data migration from Facebook Workplace
- **Mobile Excellence**: Deliver highest quality mobile-responsive experience (desktop primary, mobile-ready)
- **Production Readiness**: Move from mock data to fully functional backend with real-time capabilities

#### Background Context

Facebook Workplace is sunsetting, requiring Holiday Extras to migrate ~1,000 employees to a new internal collaboration platform. Rather than adopting another third-party solution that may also sunset, Holiday Extras has chosen to build HX Workplace as a proprietary, long-term replacement.

The current implementation has a complete, functional frontend using mock data, demonstrating all core features. However, to become production-ready, it requires:
1. Complete backend integration (currently using Supabase with partial migrations)
2. Feature parity analysis and implementation of any missing Facebook Workplace capabilities
3. Enhanced mobile-responsive UX/UI to meet highest quality standards
4. Data architecture designed to potentially import historical Facebook Workplace content (future consideration)

Timeline is flexible with no rush, allowing for quality-focused development. All departments have equal priority, with desktop being the primary platform but requiring excellent mobile web experience. A native mobile app is a future consideration after web platform completion.

#### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial PRD | 2025-11-15 | 1.0 | Brownfield enhancement for Facebook Workplace replacement | Mary (Business Analyst) |

---

## Requirements

### Functional Requirements

**Core Platform Enhancements:**

1. **FR1**: Complete backend integration (after technology selection) replacing all mock data with real database operations while maintaining existing frontend functionality
2. **FR2**: Implement real-time post creation, editing, deletion with optimistic UI updates and conflict resolution
3. **FR3**: Enable file attachments on posts (images, documents, videos) with file storage integration and size/type validation
4. **FR4**: Implement real-time commenting system with threaded replies and optimistic updates
5. **FR5**: Implement post reactions beyond "like" (e.g., love, celebrate, insightful) matching Facebook Workplace patterns
6. **FR6**: Enable post sharing with optional commentary (share to feed, share to group, share via message)

**Group/Community Features:**

7. **FR7**: Implement group creation, management, and membership controls (public, private, secret groups)
8. **FR8**: Add group-specific feeds with pinned posts and announcements
9. **FR9**: Enable group file repositories for shared document access
10. **FR10**: Implement group event creation and RSVP functionality
11. **FR11**: Add group admin roles and moderation capabilities

**Messaging Enhancements:**

12. **FR12**: Implement real-time direct messaging with typing indicators and read receipts
13. **FR13**: Support group chats with multiple participants
14. **FR14**: Enable message reactions and threaded replies in conversations
15. **FR15**: Add file sharing within messages with preview support
16. **FR16**: Implement message search within conversations

**Notifications System:**

17. **FR17**: Complete real-time notification system for all user actions (posts, comments, reactions, messages, group activity)
18. **FR18**: Add notification preferences and granular controls per notification type
19. **FR19**: Implement email digest notifications for important activity
20. **FR20**: Add browser push notifications (optional, user-configurable)

**User Profile & Directory:**

21. **FR21**: Implement comprehensive user profiles with editable information (bio, role, department, skills, interests)
22. **FR22**: Add organisational hierarchy visualisation (reporting structure, team trees)
23. **FR23**: Implement people directory with advanced filtering (department, location, skills, role)
24. **FR24**: Enable profile customisation (cover photo, profile picture, custom fields)

**Search & Discovery:**

25. **FR25**: Implement global search across posts, people, groups, and files with relevance ranking
26. **FR26**: Add search filters and facets (date range, content type, author, group)
27. **FR27**: Implement search history and saved searches
28. **FR28**: Add "trending" content discovery based on engagement

**Content Moderation:**

29. **FR29**: Implement content reporting system for inappropriate posts/comments
30. **FR30**: Add admin moderation dashboard for reviewing reported content
31. **FR31**: Enable post editing history and audit trail
32. **FR32**: Implement content archiving for compliance

**Facebook Workplace Feature Parity:**

33. **FR33**: Analyse Facebook Workplace feature set and document any missing capabilities not covered above
34. **FR34**: Implement "Work Chat" equivalent for instant messaging integration
35. **FR35**: Add "Knowledge Library" for company-wide resource sharing
36. **FR36**: Implement "Live Video" capability for company broadcasts (future phase consideration)
37. **FR37**: Add "Polls" feature for quick feedback and surveys

**Data Migration Readiness:**

38. **FR38**: Design database schema to support future import of Facebook Workplace historical data (posts, comments, groups, messages)
39. **FR39**: Create data import API endpoints and procedures (for future use)
40. **FR40**: Implement user mapping system to link Facebook Workplace users to HX Workplace accounts

### Non-Functional Requirements

**Performance:**

1. **NFR1**: Page load time must not exceed 2 seconds on desktop with fast 3G+ connection
2. **NFR2**: Feed scroll performance must maintain 60fps on modern mobile devices
3. **NFR3**: Search results must return within 500ms for queries under 100 characters
4. **NFR4**: Real-time message delivery latency must not exceed 200ms
5. **NFR5**: Support concurrent usage by up to 500 users without performance degradation
6. **NFR6**: Image uploads must complete within 5 seconds for files under 10MB

**Scalability:**

7. **NFR7**: System must support 1,000 active users with ability to scale to 2,000
8. **NFR8**: Database must handle 10,000+ posts with efficient querying and pagination
9. **NFR9**: File storage must accommodate 100GB initial capacity with expansion capability
10. **NFR10**: Notification system must handle 10,000 notifications per hour during peak times

**Reliability:**

11. **NFR11**: System uptime must be 99.5% during business hours (UK timezone)
12. **NFR12**: Data loss must be prevented with automated daily backups and point-in-time recovery
13. **NFR13**: Failed operations must gracefully degrade and provide clear user feedback
14. **NFR14**: Offline capability for reading cached content (progressive enhancement)

**Security:**

15. **NFR15**: All data transmission must use HTTPS/TLS encryption
16. **NFR16**: Authentication must use secure token-based system (JWT) with refresh tokens
17. **NFR17**: Passwords must be hashed using industry-standard algorithms (bcrypt/Argon2)
18. **NFR18**: File uploads must be scanned for malware and validated for file type
19. **NFR19**: User permissions must be role-based with principle of least privilege
20. **NFR20**: Audit logging must track all administrative actions and data modifications

**Usability:**

21. **NFR21**: Mobile-responsive design must provide excellent UX on devices from 320px to 2560px width
22. **NFR22**: Interface must support keyboard navigation and screen reader accessibility (WCAG 2.1 Level AA)
23. **NFR23**: All user-facing text must use British English spelling and terminology
24. **NFR24**: Loading states must provide clear visual feedback within 100ms
25. **NFR25**: Error messages must be user-friendly and actionable (no technical jargon)

**Maintainability:**

26. **NFR26**: Code must maintain TypeScript strict mode with comprehensive type coverage
27. **NFR27**: Components must follow established React patterns with clear separation of concerns
28. **NFR28**: CSS must use Tailwind utility classes with minimal custom CSS
29. **NFR29**: All new features must include unit tests with minimum 80% coverage
30. **NFR30**: API endpoints must be documented with OpenAPI/Swagger specifications

**Browser Compatibility:**

31. **NFR31**: Support latest 2 versions of Chrome, Firefox, Safari, and Edge
32. **NFR32**: Mobile support for iOS Safari (latest 2 major versions) and Android Chrome (latest 2 major versions)
33. **NFR33**: Graceful degradation for older browsers with clear upgrade messaging

### Compatibility Requirements

**CR1: Existing Authentication Compatibility**
- New backend authentication must seamlessly replace existing mock authentication
- Existing protected routes and authentication flows must continue to work without frontend changes
- Current test user credentials must map to real database users during development

**CR2: Database Schema Compatibility**
- Supabase migrations already created must be incorporated into final schema
- Existing TypeScript types and interfaces must remain compatible with database schema
- Frontend data models must not require breaking changes

**CR3: UI/UX Consistency**
- Existing component library (Avatar, CompanyLogo, PostCard, etc.) must be enhanced, not replaced
- Current design system (colour palette, typography, card-based UI) must be maintained
- British English must be preserved across all new features and enhancements
- Responsive design patterns must be consistent with existing implementation

**CR4: Integration Compatibility**
- Netlify deployment configuration must remain functional
- Vite build process must not require major modifications
- ESLint and TypeScript configurations must be preserved
- Existing React Router routes must continue to function during migration

---

## User Interface Enhancement Goals

### Integration with Existing UI

The current HX Workplace UI is well-designed with a custom design system featuring:
- Clean, modern card-based interface
- Holiday Extras brand-consistent colour palette
- Professional typography with display fonts
- Mobile-responsive layouts

**Enhancement Strategy:**
1. **Preserve existing component library** - Enhance current components rather than rebuild
2. **Extend design system** - Add new components following established patterns
3. **Mobile UX refinement** - Elevate mobile experience to match desktop quality
4. **Loading states** - Add sophisticated loading skeletons and progress indicators
5. **Empty states** - Design informative empty states for all features
6. **Error handling** - Implement consistent, user-friendly error messaging
7. **Accessibility** - Add ARIA labels, keyboard navigation, screen reader support

### Modified/New Screens and Views

**Enhanced Existing Screens:**
1. **Dashboard (Feed)** - Add post attachments, reactions, sharing, real-time updates
2. **Groups Page** - Add group creation, management, file repositories, events
3. **Messages Page** - Enhance with typing indicators, read receipts, group chats, file sharing
4. **Profile Page** - Add editing capabilities, organisational hierarchy, skills/interests
5. **Settings Page** - Expand notification preferences, privacy controls, account management
6. **Search Page** - Enhance with advanced filters, search history, trending content

**New Screens Required:**
7. **Group Detail Page (Enhanced)** - Files repository, events calendar, member management, pinned posts
8. **Knowledge Library** - Searchable company resources and documentation hub
9. **Admin Dashboard** - Content moderation, user management, analytics
10. **Notifications Centre** - Full notification history with filtering and management
11. **People Directory** - Advanced user discovery with department/skill filtering
12. **Live Video (Future)** - Broadcast capabilities for company-wide communications

### UI Consistency Requirements

1. **Component reusability** - All new components must follow existing patterns and be composable
2. **Design tokens** - Colours, spacing, shadows, and typography must use existing Tailwind configuration
3. **Responsive breakpoints** - Must use consistent breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
4. **Animation consistency** - Transitions must use existing duration/easing patterns
5. **Icon usage** - Continue using Lucide React with consistent sizing
6. **Form styling** - React Hook Form + Zod pattern must be applied to all new forms
7. **Loading patterns** - Skeleton loaders must match card/component shapes
8. **Error states** - Consistent error message styling and iconography

---

## Technical Constraints and Integration Requirements

### Existing Technology Stack

**Frontend Stack:**
- **Language**: TypeScript 5.5
- **Framework**: React 18.3 with functional components and hooks
- **Build Tool**: Vite 5.4 (fast HMR, optimised production builds)
- **Routing**: React Router v6.22 (client-side routing)
- **Styling**: Tailwind CSS 3.4 with PostCSS and Autoprefixer
- **Forms**: React Hook Form 7.51 + Zod 3.22 validation
- **Icons**: Lucide React 0.344
- **Type Checking**: TypeScript strict mode enabled

**Backend Stack (DECISION REQUIRED):**
- **Backend Service**: **TO BE DECIDED** (Options: Supabase, Firebase, Custom Node.js - see brownfield-architecture.md)
- **Database**: **TO BE DECIDED** (PostgreSQL recommended; exploratory migrations exist)
- **Authentication**: **TO BE DECIDED** (Options: Supabase Auth, Firebase Auth, JWT custom)
- **Storage**: **TO BE DECIDED** (Options: Supabase Storage, Firebase Storage, S3)
- **Real-time**: **TO BE DECIDED** (Options: Supabase Realtime, Firebase Firestore, Socket.io)

**Development Tools:**
- **Linting**: ESLint 9.9 with React plugins
- **Package Manager**: npm (package-lock.json present)
- **Version Control**: Git (assumed)
- **Deployment**: **TO BE DECIDED** (Options: Vercel, Netlify, Railway - see brownfield-architecture.md)

**Constraints:**
- Node.js v20+ required (recently upgraded from v18)
- TypeScript strict mode must be maintained
- British English required for all user-facing content
- Mobile-responsive design mandatory
- Desktop-primary but mobile-excellence required

### Integration Approach

**Pre-Integration Requirement:**
- **Backend Technology Selection**: Must complete backend technology decision before proceeding
- **Reference Document**: See `brownfield-architecture.md` for detailed backend/hosting options analysis

**Database Integration Strategy (Backend-Agnostic):**
- **Phase 1**: Finalize database schema based on exploratory migrations (adaptable to chosen backend)
- **Phase 2**: Create TypeScript types matching database schema (backend-specific: Supabase CLI, Prisma, or manual)
- **Phase 3**: Replace mock data (`src/data/mockData.ts`) with backend client queries
- **Phase 4**: Implement data access control (Supabase RLS, Firebase Rules, or custom middleware)
- **Phase 5**: Add database indexes for query performance optimization
- **Rollback**: Maintain mock data temporarily alongside backend for testing/rollback capability

**API Integration Strategy (Backend-Specific):**
- **Client Library**: Install chosen backend SDK (Supabase JS, Firebase SDK, or Axios for custom API)
- **API Layer**: Maintain existing `src/lib/api.ts` structure, replace implementations with backend-specific calls
- **Error Handling**: Standardize error responses from backend with user-friendly messages
- **Caching**: Implement React Query for client-side caching and state synchronization (recommended for all options)
- **Optimistic Updates**: Use React Query mutations for immediate UI feedback

**Frontend Integration Strategy (Universal):**
- **State Management**: Extend `src/contexts/AppContext.tsx` for global state (auth, user profile, notifications)
- **Real-time Subscriptions**: Add real-time listeners in context providers (backend-specific implementation)
- **Component Updates**: Enhance existing components incrementally without breaking changes
- **New Features**: Create new components following existing patterns in `src/components/`
- **Routing**: Add new routes to existing React Router configuration

**Testing Integration Strategy (Backend-Specific):**
- **Unit Tests**: Implement Jest + React Testing Library for component tests
- **Integration Tests**: Test backend integration with test database/environment
- **E2E Tests**: Consider Playwright for critical user journeys
- **Mock Backend**: Use appropriate mocking strategy (supabase-js-mock, Firebase emulator, MSW for custom API)

### Code Organisation and Standards

**File Structure Approach:**
- Maintain existing structure: `src/components/`, `src/pages/`, `src/layouts/`, `src/contexts/`, `src/lib/`, `src/utils/`
- New features follow existing categorisation
- Group-related components in subdirectories (e.g., `src/components/groups/`)
- Shared utilities in `src/utils/` (date formatting, validation, etc.)
- Database types in `src/types/` (generated from Supabase schema)

**Naming Conventions:**
- **Components**: PascalCase with descriptive names (`CreatePostCard.tsx`, `GroupMemberList.tsx`)
- **Files**: Match component names, one component per file
- **Props Interfaces**: `ComponentNameProps` convention
- **Functions**: camelCase with verb prefixes (`getUserProfile`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **CSS Classes**: Tailwind utilities, avoid custom classes except when absolutely necessary

**Coding Standards:**
- **TypeScript**: Strict mode, no `any` types without justification, explicit return types
- **React**: Functional components only, hooks for state/effects, memo/callback for optimisation
- **Imports**: Group imports (React, third-party, local components, types)
- **Comments**: JSDoc for exported functions, inline comments for complex logic only
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation support

**Documentation Standards:**
- **Component Documentation**: Props table and usage examples for reusable components
- **API Documentation**: OpenAPI spec for Netlify functions/endpoints
- **README**: Keep main README updated with new features and setup instructions
- **Changelog**: Maintain CHANGELOG.md for version tracking

### Deployment and Operations

**Build Process Integration:**
- **Vite Build**: `npm run build` produces optimised production bundle
- **Type Checking**: TypeScript compilation during build catches type errors
- **Linting**: ESLint runs during build to enforce code quality
- **Asset Optimization**: Vite automatically optimises images, fonts, and bundles

**Deployment Strategy:**
- **Platform**: Netlify continuous deployment from Git repository
- **Environment Variables**: Supabase credentials and API keys via Netlify environment settings
- **Preview Deploys**: Automatic preview for pull requests
- **Production Deploy**: Main/master branch auto-deploys to production
- **Rollback**: Netlify instant rollback capability if issues detected

**Monitoring and Logging:**
- **Error Tracking**: Implement Sentry or similar for error monitoring
- **Analytics**: Consider privacy-focused analytics (Plausible, Simple Analytics)
- **Performance Monitoring**: Use Lighthouse CI in deployment pipeline
- **Logs**: Netlify function logs for backend operations
- **User Feedback**: In-app feedback mechanism for issue reporting

**Configuration Management:**
- **Environment Files**: `.env.local` for local development (gitignored)
- **Netlify Variables**: Production secrets managed in Netlify dashboard
- **Supabase Config**: API URL and anon key in environment variables
- **Feature Flags**: Consider using environment variables for gradual feature rollout

### Risk Assessment and Mitigation

**Technical Risks:**

1. **Supabase Vendor Lock-in**
   - **Risk**: Dependency on Supabase-specific features makes migration difficult
   - **Impact**: High - Could require significant rewrite if Supabase becomes unsuitable
   - **Probability**: Low - Supabase is well-established and open-source
   - **Mitigation**: Abstract database calls behind `src/lib/api.ts` interface layer, use standard PostgreSQL where possible

2. **Real-time Performance**
   - **Risk**: Supabase real-time may not scale to 1,000 concurrent users
   - **Impact**: Medium - Delayed updates affect user experience
   - **Probability**: Low - Supabase designed for real-time at scale
   - **Mitigation**: Implement polling fallback, load test with production-like traffic, consider rate limiting

3. **File Storage Costs**
   - **Risk**: Employee file uploads could exceed storage budget
   - **Impact**: Medium - Cost overrun or need to limit uploads
   - **Probability**: Medium - 1,000 users uploading files adds up
   - **Mitigation**: Implement file size limits (10MB per file), file type restrictions, storage quotas per user, image compression

4. **TypeScript Migration Complexity**
   - **Risk**: Converting mock data to database queries may reveal type inconsistencies
   - **Impact**: Medium - Development slowdown
   - **Probability**: High - Mock data types may not match database reality
   - **Mitigation**: Generate TypeScript types from Supabase schema, incremental migration per feature, comprehensive testing

**Integration Risks:**

5. **Backend Migration Disruption**
   - **Risk**: Replacing mock data could break existing frontend functionality
   - **Impact**: High - User-facing features stop working
   - **Probability**: Medium - Complex integration with many touch points
   - **Mitigation**: Feature flags for gradual rollout, parallel mock/database mode, comprehensive integration testing

6. **Authentication Migration**
   - **Risk**: Users cannot log in after Supabase auth integration
   - **Impact**: Critical - Complete platform inaccessible
   - **Probability**: Low - Supabase Auth is mature
   - **Mitigation**: Test auth thoroughly in staging, gradual user migration, fallback to mock auth in emergency

7. **Data Consistency**
   - **Risk**: Race conditions in real-time updates cause data conflicts
   - **Impact**: Medium - Users see stale or conflicting data
   - **Probability**: Medium - Real-time systems are complex
   - **Mitigation**: Implement optimistic locking, conflict resolution strategies, use Supabase Row Level Security

**Deployment Risks:**

8. **Netlify Function Limits**
   - **Risk**: Serverless function timeout or memory limits hit during heavy usage
   - **Impact**: Medium - Requests fail under load
   - **Probability**: Low - Most operations are client-side Supabase calls
   - **Mitigation**: Optimise function performance, consider moving heavy operations to Supabase Edge Functions

9. **Environment Variable Exposure**
   - **Risk**: Supabase credentials accidentally committed to Git or exposed
   - **Impact**: High - Security breach, unauthorised database access
   - **Probability**: Low - Good practices prevent this
   - **Mitigation**: Use Netlify environment variables, `.env` files in `.gitignore`, regular security audits

10. **Third-Party Service Downtime**
    - **Risk**: Supabase or Netlify outage makes platform unavailable
    - **Impact**: High - Complete service disruption
    - **Probability**: Low - Both platforms have good uptime
    - **Mitigation**: Monitor service status, implement graceful degradation, consider multi-region deployment for critical systems

**Mitigation Strategies:**

- **Phased Rollout**: Deploy features incrementally, monitor for issues before full release
- **Feature Flags**: Use environment variables or database flags to enable/disable features
- **Comprehensive Testing**: Unit, integration, and E2E tests for all new features
- **Staging Environment**: Full staging deployment matching production for testing
- **Rollback Plan**: Netlify instant rollback + database backup/restore procedures
- **Monitoring**: Real-time error tracking and performance monitoring
- **Documentation**: Runbooks for common issues and incident response procedures

---

## Epic and Story Structure

### Epic Approach

**Epic Structure Decision**: Single comprehensive epic with sequential, risk-mitigated stories

**Rationale:**
This brownfield enhancement, while substantial, represents a cohesive transformation of HX Workplace from prototype to production. A single epic structure is appropriate because:

1. **Unified Goal**: All work serves the singular objective of replacing Facebook Workplace
2. **Interdependent Features**: Backend integration must happen before real-time features can be fully functional
3. **Consistent Context**: All stories work with the same existing codebase and patterns
4. **Incremental Value**: Each story adds production-readiness while maintaining existing functionality
5. **Risk Management**: Single epic allows clear story sequencing to minimise risk to existing system

**Story Sequencing Strategy:**
Stories are intentionally ordered to:
- Complete foundational backend work first (database, auth, core APIs)
- Layer on features incrementally (posts → comments → reactions → advanced features)
- Ensure existing functionality verified at each step
- Deliver value progressively (users see improvements throughout)
- Minimise risk by testing integration points early

---

## Epic 1: Facebook Workplace Replacement - Production Readiness

**Epic Goal**: Transform HX Workplace from a fully functional prototype using mock data into a production-ready Facebook Workplace replacement for Holiday Extras' ~1,000 employees, with complete backend integration, feature parity, exceptional mobile UX, and architecture designed for future data migration capabilities.

**Integration Requirements**:
- All existing frontend functionality must continue working throughout migration
- No breaking changes to existing component APIs
- Maintain British English and existing design system
- Ensure mobile-responsive quality matches desktop experience
- Every story must include verification of existing feature integrity

---

### Story 1.1: Backend Database Schema and Authentication Foundation

**⚠️ PREREQUISITE: Backend Technology Must Be Selected Before Starting This Story**

As a **platform administrator**,  
I want **complete database schema and authentication system**,  
so that **we have a solid foundation for all features and users can securely access the platform**.

#### Acceptance Criteria (Backend-Agnostic)

1. Database schema fully designed and deployed with all required tables (users, posts, comments, reactions, groups, messages, notifications)
2. Database schema includes indexes for common queries and foreign key constraints for data integrity
3. TypeScript types generated from database schema and imported into codebase (method varies by backend)
4. Authentication system configured with email/password provider
5. Data access control policies implemented (RLS for Supabase, Security Rules for Firebase, middleware for custom API)
6. Test user accounts migrated from mock data to real database
7. Authentication flows (login, register, logout, password reset) fully functional with chosen backend
8. Session management implemented with secure JWT token storage and refresh
9. Protected routes correctly redirect unauthenticated users to login
10. User profile data correctly loaded from database after authentication

#### Integration Verification

**IV1: Existing Functionality Verification**
- Current login/register UI remains unchanged and functional
- Protected routes continue to work as before
- User context correctly provides authenticated user information
- Logout functionality clears session and redirects appropriately

**IV2: Integration Point Verification**
- `src/lib/supabase.ts` client correctly initialised with environment variables
- `src/contexts/AppContext.tsx` successfully manages auth state with Supabase
- TypeScript types for database schema match existing mock data interfaces
- No breaking changes to components consuming auth context

**IV3: Performance Impact Verification**
- Login response time under 1 second
- Database queries for user profile under 200ms
- No memory leaks in real-time auth state subscriptions
- Session refresh happens seamlessly without user disruption

---

### Story 1.2: Social Feed Backend Integration with Real-Time Updates

As a **user**,  
I want **the social feed to display real posts from the database with real-time updates**,  
so that **I can see genuine company activity and engage with colleagues' content as it happens**.

#### Acceptance Criteria

1. Posts are created, read, updated, and deleted from Supabase database (CRUD operations complete)
2. Feed displays posts from database with pagination (20 posts per page, infinite scroll)
3. Real-time updates: new posts appear in feed without refresh using Supabase real-time subscriptions
4. Post creation form validates input and saves to database with optimistic UI update
5. Post editing allows users to modify their own posts with edit history tracking
6. Post deletion removes post from database and updates feed (soft delete for audit trail)
7. Post author information correctly joined from users table (profile picture, name, role, department)
8. Like functionality increments/decrements like count in database with optimistic UI
9. Posts display accurate timestamps with relative formatting ("2 hours ago")
10. Feed loading states display skeleton loaders matching post card design

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing `PostCard` component continues to render posts correctly
- `CreatePostCard` form validation and UI behaviour unchanged
- Feed pagination and infinite scroll still functional
- Post like button interaction remains smooth and responsive

**IV2: Integration Point Verification**
- `src/lib/api.ts` post functions successfully replaced with Supabase calls
- `src/components/feed/PostCard.tsx` correctly receives database post objects
- Real-time subscription cleanup prevents memory leaks on component unmount
- Feed updates do not cause scroll position jumping or UI flickering

**IV3: Performance Impact Verification**
- Initial feed load under 1.5 seconds
- Post creation appears in UI within 200ms (optimistic) and confirms from database within 500ms
- Real-time updates add new posts smoothly without performance degradation
- Scroll performance maintains 60fps with 50+ posts rendered

---

### Story 1.3: Comments and Reactions System Integration

As a **user**,  
I want **to comment on posts and react with different emotions**,  
so that **I can engage more expressively with colleagues' content and have conversations**.

#### Acceptance Criteria

1. Comments can be created, edited, and deleted on posts with database persistence
2. Comment threads display chronologically with newest first (configurable)
3. Real-time comment updates: new comments appear without page refresh
4. Comment author information correctly loaded from database (profile picture, name)
5. Comment edit and delete restricted to comment author (with admin override)
6. Comment count on posts updates in real-time as comments are added
7. Reactions extended beyond "like" to include: love, celebrate, insightful, curious (5 reaction types)
8. Users can change their reaction type (e.g., from like to love) without creating duplicates
9. Reaction counts display per reaction type with user list on hover/click
10. Current user's reaction visually indicated on post

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing `CommentList` component continues to display comments correctly
- Comment form submission and validation behaviour unchanged
- Post card displays comment count accurately
- Like button functionality preserved (now "like" reaction)

**IV2: Integration Point Verification**
- Comment creation/deletion updates post comment count
- Real-time comment subscriptions isolated per post (no global listener overhead)
- Reaction changes update database atomically (prevent duplicate reactions)
- Comment editing UI integrates seamlessly with existing post editing patterns

**IV3: Performance Impact Verification**
- Comment submission appears optimistically within 100ms
- Comment thread with 50+ comments loads under 500ms
- Reaction count updates within 200ms of user click
- Real-time comment subscription does not degrade feed scroll performance

---

### Story 1.4: File Attachments and Media Support

As a **user**,  
I want **to attach images, documents, and videos to my posts**,  
so that **I can share visual content and important files with my colleagues**.

#### Acceptance Criteria

1. Post creation form allows file uploads (drag-and-drop and file picker)
2. Supported file types: images (PNG, JPG, GIF), documents (PDF, DOCX, XLSX), videos (MP4, MOV)
3. File size limits enforced: 10MB per image, 20MB per document, 50MB per video
4. Files uploaded to Supabase Storage with unique file paths and access control
5. Image attachments display inline in posts with lightbox modal for full-size viewing
6. Document attachments display as download cards with file name, type, and size
7. Video attachments display with inline video player (HTML5 video controls)
8. Multiple files can be attached to a single post (up to 5 files)
9. File deletion removes file from storage when post is deleted
10. File upload progress indicator displays during upload

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing post creation flow remains functional without file attachments
- Post card layout adapts gracefully to include file attachments
- Feed rendering performance unaffected by posts with attachments
- Text-only posts continue to work exactly as before

**IV2: Integration Point Verification**
- Supabase Storage bucket correctly configured with Row Level Security
- File URLs generated from Supabase Storage are publicly accessible (with auth check)
- Post database record correctly stores file metadata (filename, type, size, storage URL)
- File upload errors display user-friendly messages (e.g., "File too large, maximum 10MB")

**IV3: Performance Impact Verification**
- Image thumbnails lazy load as user scrolls feed
- File uploads do not block post submission (background upload with progress)
- Posts with multiple images load progressively (not blocking page render)
- Video playback does not auto-play (user-initiated, bandwidth friendly)

---

### Story 1.5: Groups and Communities Backend Integration

As a **user**,  
I want **to create and join groups with dedicated feeds and member management**,  
so that **I can collaborate with specific teams and interest-based communities**.

#### Acceptance Criteria

1. Users can create new groups with name, description, privacy setting (public, private, secret)
2. Group creation saves to database with creator as first admin
3. Users can browse all public groups and search by name/description
4. Users can join public groups immediately, request to join private groups
5. Group admins can approve/reject join requests for private groups
6. Group detail page displays group-specific post feed from database
7. Posts in groups are visible only to group members (RLS policy enforcement)
8. Group membership list displays all members with role badges (admin, member)
9. Group admins can manage members (remove members, promote to admin)
10. Groups page displays user's groups and suggested groups based on department

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing `GroupsPage` component continues to display groups list
- `GroupDetailPage` route and layout remain functional
- Group card components display group information correctly
- Navigation between groups page and group detail works seamlessly

**IV2: Integration Point Verification**
- Group creation form validates required fields and saves to database
- Group membership queries correctly filter posts for group-specific feeds
- RLS policies prevent non-members from viewing private group content
- Group admin actions (member removal, role changes) update database and UI

**IV3: Performance Impact Verification**
- Groups list loads under 500ms (paginated for 100+ groups)
- Group detail page renders feed within 1 second
- Group membership check happens server-side (not client-side leak of private data)
- Real-time group feed updates do not impact main feed performance

---

### Story 1.6: Direct Messaging System Backend Integration

As a **user**,  
I want **to send direct messages to colleagues in real-time**,  
so that **I can have private conversations and quick communications**.

#### Acceptance Criteria

1. Users can start new conversations by selecting a colleague from people directory
2. Message creation saves to database with sender, recipient, and timestamp
3. Real-time message delivery: new messages appear instantly without refresh using Supabase real-time
4. Conversation list displays all user's conversations sorted by most recent activity
5. Unread message count badge displays on messaging navigation item
6. Messages within conversation display chronologically with sender/recipient distinction
7. Typing indicators show when the other person is composing a message
8. Read receipts indicate when recipient has seen messages
9. Message search within conversation (find specific messages by content)
10. Users can block/unblock other users to prevent unwanted messages

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing `MessagesPage` layout and conversation list UI unchanged
- Message bubble components continue to display correctly
- Conversation navigation and selection works as before
- Message input form validation behaviour preserved

**IV2: Integration Point Verification**
- Real-time message subscription per conversation (not global subscription)
- Unread count updates in real-time as messages are read/received
- Typing indicator debounced to prevent excessive database writes
- Message history pagination loads older messages efficiently (20 messages per page)

**IV3: Performance Impact Verification**
- Message send latency under 200ms (optimistic UI update)
- Conversation list loads under 500ms (even with 100+ conversations)
- Real-time typing indicator updates do not cause UI jank
- Message history scrolling maintains 60fps with 500+ messages

---

### Story 1.7: Group Chats and Multi-Participant Messaging

As a **user**,  
I want **to create group chats with multiple colleagues**,  
so that **I can have team discussions and coordinate with multiple people efficiently**.

#### Acceptance Criteria

1. Users can create group chats and invite multiple participants (3-50 participants)
2. Group chat creation saves to database with creator as admin and all participants added
3. Group chat messages display with sender name and avatar (since multiple participants)
4. Users can leave group chats (except creator/admin must transfer ownership first)
5. Group chat admins can add/remove participants
6. Group chat name can be customised by admin (default: participant names comma-separated)
7. Real-time message updates for all group chat participants
8. Typing indicators show "Name is typing..." for group chats
9. Read receipts show read count and list of readers (e.g., "Read by 3 people")
10. Group chat notifications follow same unread logic as direct messages

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing messaging page UI seamlessly includes group chats in conversation list
- Message bubble components correctly handle group chat messages (show sender name)
- Conversation switching between direct messages and group chats works smoothly
- Message input and sending experience consistent across chat types

**IV2: Integration Point Verification**
- Group chat database schema distinguishes between direct and group conversations
- Participant management updates conversation membership table
- Real-time subscriptions handle multi-participant message delivery efficiently
- Unread count logic correctly accounts for group chat messages

**IV3: Performance Impact Verification**
- Group chat message delivery latency under 300ms to all participants
- Group chat with 50 participants does not degrade message sending performance
- Typing indicators in group chats do not overwhelm real-time system (max 3 visible)
- Read receipt calculations perform efficiently (cached per message)

---

### Story 1.8: Notifications System Backend Integration

As a **user**,  
I want **to receive real-time notifications for all important activity**,  
so that **I stay informed about interactions with my content and relevant updates**.

#### Acceptance Criteria

1. Notifications created in database for all user actions: post likes, comments, reactions, mentions, group invites, messages
2. Real-time notification delivery using Supabase real-time (notifications appear instantly)
3. Notification bell icon displays unread count badge
4. Notifications dropdown shows recent notifications (last 20) with infinite scroll for more
5. Clicking notification marks as read and navigates to relevant content (post, message, group)
6. Notifications display appropriate icon, message, and timestamp (e.g., "John Smith liked your post")
7. Notification preferences allow users to enable/disable specific notification types
8. Email digest notifications sent daily for important unread notifications (configurable)
9. Browser push notifications for messages and mentions (opt-in, user-configurable)
10. Notification history page shows all notifications with filtering (all, unread, mentions, messages)

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing `NotificationsDropdown` component continues to display notification UI
- Notification icon in header displays correctly with unread badge
- Notification interaction (click to read, navigate) works as expected
- Settings page notification preferences section remains functional

**IV2: Integration Point Verification**
- Notification creation triggers (post like, comment, etc.) correctly save to database
- Real-time notification subscription updates notification count in real-time
- Notification read/unread status persists across sessions
- Notification links correctly route to relevant content (post ID, message thread, group)

**IV3: Performance Impact Verification**
- Notification count updates within 200ms of action
- Notifications dropdown loads under 300ms (even with 100+ notifications)
- Real-time notification subscription does not degrade app performance
- Email digest generation processes efficiently in background job

---

### Story 1.9: User Profiles and People Directory Enhancement

As a **user**,  
I want **comprehensive user profiles with organisational hierarchy and searchable people directory**,  
so that **I can discover colleagues, understand reporting structures, and connect with people**.

#### Acceptance Criteria

1. User profile page displays full user information from database: name, role, department, bio, skills, interests
2. Users can edit their own profiles (bio, profile picture, cover photo, skills, interests)
3. Profile picture and cover photo upload to Supabase Storage with image cropping/resizing
4. Organisational hierarchy visualised on profile page (reporting manager, direct reports)
5. People directory page lists all users with filtering: department, location, role, skills
6. People directory search searches across name, role, department, skills, bio
7. People directory displays user cards with key information (name, role, department, profile picture)
8. Clicking user card navigates to full profile page
9. Profile page shows user's recent posts and activity (last 10 posts)
10. Users can follow/unfollow colleagues to see their updates in personalised feed (future enhancement prep)

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing `ProfilePage` component continues to display user information
- Profile navigation from feed posts and messages works correctly
- User avatar component displays profile pictures throughout app
- Profile settings page integrates with general settings

**IV2: Integration Point Verification**
- Profile editing saves changes to database and updates across all app instances in real-time
- Profile picture upload resizes images to standard dimensions (200x200px)
- Organisational hierarchy queries efficiently load manager and direct reports
- People directory filtering and search perform without full-page reload (client-side)

**IV3: Performance Impact Verification**
- Profile page loads under 1 second (including posts feed)
- Profile picture upload and resize completes within 3 seconds
- People directory initial load under 1 second (100 users)
- People directory search returns results within 300ms

---

### Story 1.10: Search and Discovery System Integration

As a **user**,  
I want **powerful global search across content and people with relevant results**,  
so that **I can quickly find information, posts, groups, and colleagues**.

#### Acceptance Criteria

1. Global search bar in header searches across: posts, people, groups, files
2. Search results display categorised by type: Posts, People, Groups, Files
3. Search relevance ranking prioritises: exact matches, recent content, engagement level
4. Search filters allow narrowing results: date range, content type, author, group
5. Search history saved per user (last 10 searches) for quick re-search
6. Saved searches allow users to bookmark frequent searches (e.g., "Marketing updates")
7. Trending content section shows most engaged posts from last 24 hours
8. Search results paginate efficiently (20 results per page, infinite scroll)
9. Search highlights matching text in results (bold search terms in post content)
10. Search performs full-text search in post content, comments, user bio, group descriptions

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing `SearchPage` component layout and UI preserved
- Search input in header continues to function and route to search page
- Search result cards use existing post card and user card components
- Navigation from search results to content pages works correctly

**IV2: Integration Point Verification**
- Supabase full-text search (PostgreSQL `to_tsvector`) configured for searchable columns
- Search queries execute efficiently with database indexes on searchable fields
- Search filters apply as query parameters and maintain state across navigation
- Trending content calculation runs as database function (cached, updated hourly)

**IV3: Performance Impact Verification**
- Search results return within 500ms for common queries
- Search autocomplete/suggestions appear within 200ms (debounced)
- Search page renders results without blocking (loading states for each category)
- Full-text search on 10,000+ posts performs acceptably (under 1 second)

---

### Story 1.11: Content Moderation and Admin Dashboard

As an **administrator**,  
I want **content moderation tools and admin dashboard**,  
so that **I can maintain platform quality, handle reported content, and manage users**.

#### Acceptance Criteria

1. Users can report posts, comments, or user profiles for: inappropriate content, spam, harassment, other
2. Reports save to database with reporter, reported content, reason, and timestamp
3. Admin dashboard displays all pending reports with content preview
4. Admins can review reported content and take action: dismiss report, hide content, warn user, ban user
5. Content hiding removes content from public feed but preserves in database for audit
6. User warnings send notification to user explaining policy violation
7. User bans prevent login and hide all user's content from platform
8. Admin audit log records all admin actions (content moderation, user management)
9. Admin dashboard displays platform statistics: active users, post count, group count, report count
10. Admin dashboard accessible only to users with admin role (role-based access control)

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing user-facing features unaffected by admin dashboard addition
- Report button integration on posts/comments does not alter existing UI significantly
- Admin users see admin navigation item; non-admin users do not
- Regular users cannot access admin routes (redirected with error message)

**IV2: Integration Point Verification**
- Admin role stored in user profile database table and checked in RLS policies
- Content visibility (hidden/visible) enforced at database level (RLS policies)
- Admin actions trigger notifications to affected users (warnings, bans)
- Audit log immutable (append-only) to maintain compliance trail

**IV3: Performance Impact Verification**
- Report submission does not block user experience (background save)
- Admin dashboard loads under 2 seconds (including statistics queries)
- Content hiding updates throughout app within 500ms (real-time propagation)
- Audit log queries paginate efficiently (not loading all history at once)

---

### Story 1.12: Knowledge Library and Resource Sharing

As a **user**,  
I want **centralised knowledge library for company resources and documentation**,  
so that **I can easily access important information and share knowledge with colleagues**.

#### Acceptance Criteria

1. Knowledge Library page displays categorised resources: policies, guides, templates, training
2. Admins can create resource categories and upload documents/links
3. Resources display with title, description, category, upload date, and file/link
4. Resources searchable by title, description, category tags
5. Users can bookmark favourite resources for quick access
6. Resources support file attachments (PDFs, documents) and external links
7. Resource view count tracked to identify popular/useful content
8. Resource comments allow users to ask questions and discuss content
9. Admins can feature important resources at top of library (pinned resources)
10. Resource permissions allow public (all users) or restricted (specific groups/roles) access

#### Integration Verification

**IV1: Existing Functionality Verification**
- Knowledge Library integrated into main navigation without disrupting existing menu
- Resource viewing experience consistent with existing content viewing patterns
- File downloading uses same attachment handling as post attachments
- Search functionality integrates with existing global search

**IV2: Integration Point Verification**
- Resource database schema separate from posts but uses similar patterns
- Resource categories managed through admin dashboard
- Resource bookmarking uses similar logic to post reactions/likes
- Resource access control enforced via RLS policies (group/role-based)

**IV3: Performance Impact Verification**
- Knowledge Library page loads under 1.5 seconds
- Resource search results return within 500ms
- File downloads initiate immediately (pre-signed URLs from storage)
- Resource view count increments without blocking page load

---

### Story 1.13: Mobile UX/UI Excellence and Responsive Refinement

As a **mobile user**,  
I want **exceptional mobile experience matching desktop quality**,  
so that **I can productively use HX Workplace on any device**.

#### Acceptance Criteria

1. All pages fully responsive and functional on mobile devices (320px to 768px width)
2. Touch-friendly UI: buttons minimum 44px hit area, adequate spacing between interactive elements
3. Mobile navigation optimised: hamburger menu, bottom navigation bar for key features
4. Mobile gestures supported: swipe to dismiss modals, pull-to-refresh feeds
5. Mobile-optimised forms: appropriate input types (email, tel), auto-focus, clear labels
6. Image optimisation: responsive images with `srcset`, lazy loading, compression
7. Mobile performance: Lighthouse mobile score 90+, First Contentful Paint under 1.5 seconds
8. Offline support: cached content readable offline with clear offline indicator
9. Mobile notifications: browser push notifications for messages and mentions
10. Accessibility: WCAG 2.1 Level AA compliance on mobile (touch targets, contrast, screen reader support)

#### Integration Verification

**IV1: Existing Functionality Verification**
- All existing mobile layouts preserved and enhanced (not replaced)
- Desktop experience unaffected by mobile optimisations
- Component responsive breakpoints consistent across app (no layout shifting)
- Feature parity: all desktop features accessible on mobile (no missing functionality)

**IV2: Integration Point Verification**
- Mobile navigation component switches appropriately at breakpoint (768px)
- Touch gestures do not conflict with native browser gestures (e.g., browser refresh)
- Mobile form validation displays errors clearly above keyboard
- Image lazy loading does not cause layout shifts (reserve space for images)

**IV3: Performance Impact Verification**
- Mobile network performance tested on Fast 3G (Chrome DevTools throttling)
- Bundle size optimised: code splitting, tree shaking, lazy loading of routes
- Mobile battery usage reasonable (no excessive re-renders or subscriptions)
- Scroll performance 60fps on mobile devices (iPhone 12, Samsung Galaxy S21)

---

### Story 1.14: Facebook Workplace Data Migration Readiness

As a **platform administrator**,  
I want **architecture designed to support Facebook Workplace data import**,  
so that **we have the option to migrate historical content and preserve company knowledge**.

#### Acceptance Criteria

1. Database schema includes fields for external content IDs (Facebook Workplace post IDs)
2. Data import API endpoints created for: users, posts, comments, groups, messages
3. User mapping system implemented to match Facebook Workplace users to HX Workplace accounts
4. Import process handles duplicate detection (skip already imported content)
5. Imported content preserves original timestamps and author attribution
6. Import dry-run mode allows testing import without committing data
7. Import progress tracking and error logging for troubleshooting
8. Imported content flagged as "imported" to distinguish from native content
9. Import rollback capability to revert import if issues detected
10. Import documentation created with step-by-step instructions for future use

#### Integration Verification

**IV1: Existing Functionality Verification**
- Data import does not disrupt existing user-generated content
- Import process runs as background job (not blocking platform usage)
- Existing posts, comments, groups unaffected by import data structures
- User experience unchanged (import happens behind the scenes)

**IV2: Integration Point Verification**
- Import API endpoints secured with admin-only authentication
- Import data validation prevents invalid/malicious data injection
- Database foreign key constraints maintained during import (referential integrity)
- Import process respects existing privacy settings and permissions

**IV3: Performance Impact Verification**
- Import process handles large datasets (10,000+ posts) without timeout
- Import does not degrade platform performance during execution (rate limited)
- Import progress updates in real-time for admin monitoring
- Database remains responsive during import (batched inserts, not single transaction)

---

### Story 1.15: Settings, Privacy, and User Preferences Enhancement

As a **user**,  
I want **comprehensive settings for notifications, privacy, and personalisation**,  
so that **I can control my experience and protect my privacy**.

#### Acceptance Criteria

1. Settings page with sections: Profile, Notifications, Privacy, Preferences, Account
2. Notification settings allow granular control: post likes, comments, reactions, mentions, messages, group activity
3. Email digest preferences: daily digest on/off, digest time preference (morning/evening)
4. Privacy settings: profile visibility (public, colleagues only, private), post default privacy (public, group-only)
5. Preference settings: language (British English default), theme (light/dark mode preparation), timezone
6. Account settings: change password, email address, delete account
7. Push notification settings: enable/disable browser push, manage notification permissions
8. Data export: users can download their data (posts, comments, messages) in JSON format
9. Account deletion: soft delete with 30-day recovery period before permanent deletion
10. Settings changes save immediately to database with success confirmation

#### Integration Verification

**IV1: Existing Functionality Verification**
- Existing `SettingsPage` component layout and navigation preserved
- Settings form validation follows existing React Hook Form + Zod patterns
- Settings changes apply immediately without requiring logout/login
- Profile settings sync with profile page edits (consistent data)

**IV2: Integration Point Verification**
- Notification preferences stored in user profile and respected by notification system
- Privacy settings enforced at database level (RLS policies updated based on preferences)
- Account deletion marks user as deleted (not hard delete) and hides all content
- Data export generates complete data package (all user-generated content)

**IV3: Performance Impact Verification**
- Settings page loads under 1 second
- Settings changes save within 300ms with optimistic UI update
- Data export generates within 30 seconds for typical user (1,000 posts/comments)
- Account deletion processes efficiently (soft delete, no cascade deletion blocking)

---

### Story 1.16: Production Deployment and Monitoring Setup

As a **platform administrator**,  
I want **production deployment with monitoring, logging, and error tracking**,  
so that **we can maintain platform reliability and quickly respond to issues**.

#### Acceptance Criteria

1. Production deployment configured on Netlify with automatic deploys from main branch
2. Environment variables configured in Netlify: Supabase URL, API key, secrets
3. Custom domain configured with SSL certificate (HTTPS enforced)
4. Error tracking implemented (Sentry or similar) for frontend and backend errors
5. Performance monitoring: Lighthouse CI in deployment pipeline, alerting on score drops
6. Uptime monitoring: health check endpoint, external monitoring service (UptimeRobot, Pingdom)
7. Analytics implemented: privacy-focused analytics (Plausible or Simple Analytics)
8. Logging strategy: Netlify function logs, Supabase database logs, frontend error logs to Sentry
9. Backup strategy: automated daily database backups to separate storage, tested restore procedure
10. Incident response runbook documented: common issues, escalation procedures, rollback steps

#### Integration Verification

**IV1: Existing Functionality Verification**
- Production deployment mirrors development environment exactly (no feature differences)
- All existing features functional in production (smoke tests pass)
- Performance in production matches staging (no unexpected slowdowns)
- User data migrates to production without loss or corruption

**IV2: Integration Point Verification**
- Sentry captures errors without blocking user experience (asynchronous)
- Analytics tracking respects user privacy (no PII collected)
- Health check endpoint returns quickly without hitting database (status page)
- Backup restoration tested in staging environment (verified working)

**IV3: Performance Impact Verification**
- Error tracking adds negligible overhead (< 10ms per page load)
- Analytics script loads asynchronously (non-blocking)
- Monitoring does not impact user-facing performance
- Backup process runs during off-peak hours (minimal database load)

---

## Appendix: Facebook Workplace Feature Comparison

### Features Implemented in HX Workplace

✅ **News Feed**: Social feed with posts, likes, comments, sharing  
✅ **Groups**: Public and private groups with dedicated feeds  
✅ **Direct Messaging**: One-on-one conversations  
✅ **Group Chats**: Multi-participant messaging  
✅ **Notifications**: Real-time notifications for all activity  
✅ **User Profiles**: Comprehensive profiles with organisational hierarchy  
✅ **People Directory**: Searchable employee directory  
✅ **Search**: Global search across content and people  
✅ **Knowledge Library**: Centralised resource repository  
✅ **Admin Tools**: Content moderation and user management  
✅ **File Attachments**: Images, documents, videos on posts  
✅ **Reactions**: Multiple reaction types (like, love, celebrate, etc.)  

### Features Deferred for Future Phases

⏳ **Live Video**: Company broadcasts (complex, low priority)  
⏳ **Workplace Chat Desktop App**: Native desktop messaging (web-first strategy)  
⏳ **Integrations**: Third-party tool integrations (e.g., Google Drive, Microsoft Teams)  
⏳ **Mobile Native Apps**: iOS and Android apps (after web platform stable)  
⏳ **Workplace Bots**: Automated chatbots (advanced feature)  
⏳ **Translation**: Auto-translation for multilingual posts (not needed initially)  
⏳ **Stories**: Ephemeral content (Instagram-style stories)  

---

**End of PRD**

