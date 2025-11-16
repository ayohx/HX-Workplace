# HX Workplace

A modern corporate social networking and collaboration platform built for Holiday Extras. An internal workplace hub that enables employees to connect, share updates, join interest groups, and communicate within the organisation.

## Features

- 🔐 **Authentication System** - Secure login and registration with protected routes
- 📱 **Social Feed** - Create posts, like, comment, and share updates with attachments
- 👥 **Groups/Communities** - Public and private groups for team collaboration
- 💬 **Messaging System** - Direct messages between users with read/unread status
- 👤 **User Profiles** - Comprehensive profiles with organisational hierarchy
- 🔔 **Notifications** - Real-time notification system with read/unread tracking
- 🔍 **Search** - Find users, posts, and groups across the platform
- ⚙️ **Settings** - Customisable notification, privacy, and preference settings

## Technology Stack

### Frontend
- **React 18.3** with **TypeScript** - Type-safe component development
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **React Hook Form + Zod** - Form validation

### Backend
- **Supabase** - Backend-as-a-Service (authentication, database)
- Currently using mock data for development

### Deployment
- **Netlify** - Hosting and serverless functions
- Edge functions configured for API routes

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "HX Workplace"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Test User Credentials

For testing and development purposes, use any of the following accounts:

| Name | Email | Password | Role | Department |
|------|-------|----------|------|------------|
| John Smith | john.smith@company.com | password123 | Product Manager | Product |
| Sarah Johnson | sarah.johnson@company.com | password123 | Frontend Developer | Engineering |
| Michael Brown | michael.brown@company.com | password123 | UX Designer | Design |
| Emily Davis | emily.davis@company.com | password123 | Marketing Specialist | Marketing |
| David Wilson | david.wilson@company.com | password123 | Backend Developer | Engineering |

**Note:** All test users have the same password: `password123`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── common/      # Shared components (Avatar, CompanyLogo)
│   ├── feed/        # Post and comment components
│   ├── layout/      # Header, Sidebar, MobileNav
│   ├── notifications/
│   └── user/        # User menu components
├── contexts/        # React Context for state management
├── data/           # Mock data for development
├── layouts/        # Auth and Main layout wrappers
├── lib/            # API and Supabase configuration
├── pages/          # Route components
└── utils/          # Helper functions
```

## Design System

The application uses a custom design system with:
- Custom colour palette (primary and neutral shades)
- Consistent typography with display fonts
- Card-based UI with shadows
- Mobile-responsive design
- British English for all user-facing text

## Development Status

Currently in development phase:
- ✅ Frontend structure complete and functional
- ✅ Mock data implementation
- ✅ Component library built
- ✅ Routing and navigation configured
- ⏳ Supabase integration in progress
- ⏳ Backend API connections pending
- ⏳ Production deployment pending

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Licence

Proprietary - Holiday Extras Internal Use Only

