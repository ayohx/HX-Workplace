# 🔍 Supabase Connection Test Guide

This guide helps you verify your Supabase setup is working correctly for the HX Workplace project.

## Quick Tests (Choose One)

### ✅ **Method 1: Browser Test (Easiest - Recommended)**

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open the test page:**
   ```
   http://localhost:5173/test-supabase.html
   ```

3. **Click "Run Connection Tests"**
   - All tests should pass ✅
   - If any fail, check the error details

**What it tests:**
- ✅ Environment variables loaded
- ✅ Supabase client initialized
- ✅ Database connection working
- ✅ Posts table accessible
- ✅ Profiles table accessible
- ✅ Real-time subscriptions working

---

### ✅ **Method 2: Node.js Test Script**

1. **Install dotenv (if not already):**
   ```bash
   npm install dotenv
   ```

2. **Run the test script:**
   ```bash
   node test-supabase-connection.js
   ```

3. **Check the output:**
   - All tests should show ✅
   - If any show ❌, read the error messages

---

### ✅ **Method 3: Supabase Dashboard (Manual Check)**

1. **Go to your Supabase dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Select your project**

3. **Check these sections:**

   **A. Table Editor** (Left sidebar)
   - ✅ Verify `posts` table exists
   - ✅ Verify `profiles` table exists
   - ✅ Verify `reactions` table exists
   - ✅ Check if you have sample data

   **B. Authentication** (Left sidebar → Authentication)
   - ✅ Verify you have test users
   - ✅ Try creating a test user if none exist

   **C. API Settings** (Left sidebar → Settings → API)
   - ✅ Copy your Project URL
   - ✅ Copy your anon/public key
   - ✅ Verify these match your `.env` file:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

---

### ✅ **Method 4: Browser DevTools Test**

1. **Start dev server and open app:**
   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

2. **Open DevTools Console** (F12 or Cmd+Option+I)

3. **Run these commands:**

   ```javascript
   // Test 1: Check Supabase is available
   console.log('Supabase:', window.supabase);
   
   // Test 2: Fetch posts
   const { data, error } = await fetch('/api/posts')
     .then(r => r.json());
   console.log('Posts:', data, 'Error:', error);
   
   // Test 3: Check auth state
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Session:', session);
   ```

---

## Common Issues & Solutions

### ❌ **"Missing environment variables"**

**Problem:** `.env` file not found or variables not set

**Solution:**
1. Check if `.env` file exists in project root
2. Verify it contains:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Restart dev server after changing `.env`

---

### ❌ **"Table 'posts' not found"**

**Problem:** Database migrations not applied

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the migration file: `supabase/migrations/20251115000000_complete_schema.sql`
3. Or use Supabase CLI:
   ```bash
   supabase db push
   ```

---

### ❌ **"Connection refused" or "Network error"**

**Problem:** Wrong Supabase URL or project paused

**Solution:**
1. Check Supabase project is active (not paused)
2. Verify URL in `.env` matches dashboard
3. Check internet connection
4. Try accessing Supabase dashboard to confirm project is running

---

### ❌ **"Real-time subscriptions failed"**

**Problem:** Real-time not enabled on table

**Solution:**
1. Go to Supabase Dashboard → Database → Replication
2. Enable replication for `posts` table
3. Or run SQL:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE posts;
   ```

---

## Expected Test Results

### ✅ **All Tests Pass:**
```
✅ Environment variables found
✅ Supabase client initialized
✅ Database connection successful
✅ Posts table accessible
✅ Profiles table accessible
✅ Real-time subscriptions working
```

**Next steps:**
- Your Supabase setup is ready! 🎉
- Continue with Story 1.2 development
- Test features in your app

---

### ⚠️ **Some Tests Fail:**

**If 1-2 tests fail:**
- Read the error messages carefully
- Check the "Common Issues" section above
- Fix the specific issue and re-run tests

**If 3+ tests fail:**
- Your Supabase project may not be set up yet
- Run database migrations first
- Verify `.env` file is correct
- Check Supabase project is active

---

## Quick Verification Checklist

Before starting development, verify:

- [ ] `.env` file exists with correct Supabase credentials
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] Can access Supabase dashboard
- [ ] Database tables exist (posts, profiles, reactions)
- [ ] At least one test user exists in Authentication
- [ ] Test page shows all tests passing
- [ ] App loads at `http://localhost:5173`

---

## Need Help?

**If tests still fail after trying solutions:**

1. **Check Supabase Status:**
   - https://status.supabase.com

2. **Review Supabase Docs:**
   - https://supabase.com/docs

3. **Check Project Logs:**
   - Supabase Dashboard → Logs

4. **Common Debugging Steps:**
   - Clear browser cache
   - Restart dev server
   - Check browser console for errors
   - Verify network requests in DevTools

---

## Success Indicators

**Your setup is working when:**

✅ Test page shows all green checkmarks
✅ App loads without console errors
✅ Can see posts in the feed (if any exist)
✅ Can create a new post successfully
✅ Real-time updates work (test with two browser tabs)

**Ready to develop!** 🚀
