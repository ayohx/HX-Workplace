# Database & Authentication Setup Guide

This guide will help you complete the manual setup steps for Story 1.1 (Database & Auth Foundation).

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install locally
   ```bash
   npm install -g supabase
   ```

---

## Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - **Name**: HX Workplace (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Select closest to your users
4. Click "Create new project" (wait 2-3 minutes for provisioning)

---

## Step 2: Configure Environment Variables

1. **Get your project credentials** from Supabase dashboard:
   - Go to Settings → API
   - Copy **Project URL** (looks like ``)
   - Copy **anon/public key** (long string starting with ``)

2. **Create `.env.local` file** in project root:
   ```bash
   # From project root directory
   cp docs/env.example .env.local  # Or create manually
   ```

3. **Add your credentials** to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Verify** environment variables are loaded:
   ```bash
   # Restart your dev server
   npm run dev
   ```

---

## Step 3: Initialize Supabase Local Development (Optional)

If you want to work locally with Supabase:

```bash
# Initialize Supabase in project (if not already done)
supabase init

# Link to your cloud project
supabase link --project-ref your-project-ref

# Start local Supabase
supabase start
```

---

## Step 4: Run Database Migrations

### Option A: Via Supabase Dashboard (Recommended for beginners)

1. Go to **SQL Editor** in Supabase dashboard
2. Click "+ New query"
3. **Copy the entire contents** of:
   - `supabase/migrations/20251115000000_complete_schema.sql`
4. **Paste into SQL Editor**
5. Click **"Run"** (bottom right)
6. Verify success message: ✅ "Success. No rows returned"

### Option B: Via Supabase CLI (Recommended for development)

```bash
# From project root
supabase migration up
```

### Verify Migration Success

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - ✅ profiles
   - ✅ posts
   - ✅ comments
   - ✅ reactions
   - ✅ groups
   - ✅ group_members
   - ✅ conversations
   - ✅ conversation_participants
   - ✅ messages
   - ✅ notifications

---

## Step 5: Configure Authentication

1. **Enable Email/Password Provider**:
   - Go to **Authentication → Providers**
   - Ensure **Email** is enabled
   - Click **Email** to configure

2. **Configure Email Templates** (British English):
   - Go to **Authentication → Email Templates**
   - Update **Confirmation** template:
     ```
     Subject: Confirm your email address for HX Workplace
     
     Hello,
     
     Please confirm your email address by clicking the link below:
     {{ .ConfirmationURL }}
     
     If you didn't sign up for HX Workplace, you can safely ignore this email.
     
     Best regards,
     The HX Workplace Team
     ```
   - Update **Password Reset** template similarly

3. **Set Redirect URLs**:
   - Go to **Authentication → URL Configuration**
   - Add **Site URL**: `http://localhost:5173` (for development)
   - Add **Redirect URLs**:
     - `http://localhost:5173/**` (development)
     - `https://yourproductiondomain.com/**` (production, when ready)

4. **Configure JWT Settings** (optional, defaults are fine):
   - Go to **Settings → API**
   - JWT expiry: 3600 seconds (1 hour) - default is good
   - Enable refresh token rotation: ✅ Enabled

---

## Step 6: Create Test Users

You have two options for creating test users:

### Option A: Via Application Signup Flow (Recommended)

1. Start your application: `npm run dev`
2. Go to registration page
3. Register each test user:

   **User 1 - Sarah Chen (Product Manager)**
   - Name: Sarah Chen
   - Email: sarah.chen@company.com
   - Password: [choose a development password]
   - Role: Product Manager
   - Department: Product

   **User 2 - Marcus Johnson (Senior Developer)**
   - Name: Marcus Johnson
   - Email: marcus.johnson@company.com
   - Password: [choose a development password]
   - Role: Senior Developer
   - Department: Engineering

   **User 3 - Emily Rodriguez (UX Designer)**
   - Name: Emily Rodriguez
   - Email: emily.rodriguez@company.com
   - Password: [choose a development password]
   - Role: UX Designer
   - Department: Design

   **User 4 - James Wilson (DevOps Engineer)**
   - Name: James Wilson
   - Email: james.wilson@company.com
   - Password: [choose a development password]
   - Role: DevOps Engineer
   - Department: Operations

   **User 5 - Lisa Park (Data Analyst)**
   - Name: Lisa Park
   - Email: lisa.park@company.com
   - Password: [choose a development password]
   - Role: Data Analyst
   - Department: Analytics

### Option B: Via Supabase Dashboard

1. Go to **Authentication → Users**
2. Click "+ Add user"
3. For each user:
   - Enter email address
   - Generate temporary password
   - Check "Auto Confirm User" (for development)
   - Click "Create User"
4. Manually insert profile data via SQL Editor:
   ```sql
   INSERT INTO profiles (id, name, email, role, department, avatar)
   VALUES
     ('user-id-from-auth', 'Sarah Chen', 'sarah.chen@company.com', 'Product Manager', 'Product', 'https://avatar-url'),
     -- Repeat for other users
   ;
   ```

---

## Step 7: Verify Setup

### Test Authentication Flows

1. **Login Test**:
   - Go to login page
   - Use test credentials
   - ✅ Should redirect to dashboard with user profile loaded

2. **Logout Test**:
   - Click logout button
   - ✅ Should redirect to login page
   - ✅ Session should be cleared

3. **Session Persistence Test**:
   - Login to application
   - Refresh page (F5)
   - ✅ Should remain logged in (no redirect to login)

4. **Protected Route Test**:
   - Logout
   - Try accessing protected route directly (e.g., `/dashboard`)
   - ✅ Should redirect to `/login`

5. **Invalid Credentials Test**:
   - Try logging in with wrong password
   - ✅ Should show error message
   - ✅ Should remain on login page

### Verify Database Operations

1. **Check Tables**:
   - Go to Supabase **Table Editor**
   - Open `profiles` table
   - ✅ Should see test user profiles

2. **Check RLS Policies**:
   - Go to **Authentication → Policies**
   - ✅ Each table should have RLS policies listed

3. **Test Posting** (if UI is ready):
   - Login as a test user
   - Create a post
   - Go to Supabase **Table Editor → posts**
   - ✅ Should see the new post

---

## Troubleshooting

### Error: "Missing Supabase environment variables"

- **Cause**: `.env.local` file not found or variables not set
- **Fix**: Create `.env.local` with correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- **Verify**: Restart dev server after creating/updating `.env.local`

### Error: "relation public.profiles does not exist"

- **Cause**: Migrations not run
- **Fix**: Follow Step 4 to run migrations
- **Verify**: Check Supabase Table Editor for `profiles` table

### Error: "new row violates row-level security policy"

- **Cause**: RLS policies not created or incorrectly configured
- **Fix**: Re-run migration (it includes policies)
- **Verify**: Check Authentication → Policies in Supabase dashboard

### Users can't see each other's posts

- **Cause**: RLS policies too restrictive
- **Fix**: Check policy for `posts` table - SELECT should use `(true)` to allow all authenticated users to view
- **Verify**: Test with two different user accounts

### Session not persisting after refresh

- **Cause**: Auth configuration issue
- **Fix**: Verify `persistSession: true` in `src/lib/supabase.ts`
- **Check**: Browser local storage should have `sb-<project>-auth-token` key

---

## Next Steps

After completing this setup:

1. ✅ Mark manual tasks as complete in Story 1.1
2. ✅ Test all authentication flows thoroughly
3. ✅ Proceed to remaining tasks (protected routes, comprehensive tests)
4. ✅ Update Story 1.1 status to "Ready for Review" once all tasks complete

---

## Security Reminders

⚠️ **Important**:
- NEVER commit `.env.local` to version control
- NEVER share your Supabase service role key (only use anon key in frontend)
- Use strong passwords for test accounts
- Rotate credentials if accidentally exposed
- In production, use environment-specific credentials

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

---

*Last Updated: 2025-01-15*
*Story: 1.1 - Database & Auth Foundation*

