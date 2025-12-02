# Debugging White Screen Issue

## Issues Fixed

### ✅ 1. Image/File/Emoji Buttons Now Work
- **Fixed**: Added onClick handlers to all buttons
- **Status**: Buttons now show alerts (implementation coming in Story 1.4)
- **Test**: Click Photo/File/Emoji icons - should see alert messages

### ✅ 2. Better Error Handling & Logging
- **Fixed**: Added comprehensive console logging for posts loading
- **Fixed**: Added safety checks for empty/null data
- **Fixed**: Ensured loading state always resolves (prevents infinite loading)

### ✅ 3. Dashboard Safety Checks
- **Fixed**: Dashboard now checks for currentUser before rendering
- **Fixed**: Handles empty posts array gracefully
- **Fixed**: Handles empty groups array gracefully

---

## Debugging Steps for White Screen

### Step 1: Check Browser Console

Open DevTools (F12) → Console tab and look for:

**Expected Logs (Normal Flow):**
```
Loading posts for user: [user-id]
Posts loaded successfully: X posts
Transformed posts: X
```

**Error Indicators:**
- `Error loading posts:` → Database query failed
- `getPosts returned invalid data:` → Query returned unexpected format
- `Dashboard rendered without currentUser` → Auth state issue

### Step 2: Check Network Tab

DevTools → Network tab → Filter: "posts" or "supabase"

**What to Look For:**
- Is there a request to Supabase?
- What's the response status? (200 = success, 401 = auth error, 500 = server error)
- What's the response body? (Check Preview or Response tab)

**Common Issues:**
- **401 Unauthorized**: RLS policy blocking access
- **404 Not Found**: Table doesn't exist or wrong table name
- **500 Server Error**: Database query error

### Step 3: Check Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Run this query manually:

```sql
SELECT 
  p.*,
  pr.id as profile_id,
  pr.name,
  pr.avatar,
  pr.role,
  pr.department
FROM posts p
LEFT JOIN profiles pr ON p.user_id = pr.id
WHERE p.deleted_at IS NULL
ORDER BY p.created_at DESC
LIMIT 20;
```

**If this query fails:**
- Check if `posts` table exists
- Check if `profiles` table exists
- Check if `deleted_at` column exists (migration might not be applied)

**If this query works but app doesn't:**
- RLS policies might be blocking the app user
- Check RLS policies in Supabase Dashboard → Authentication → Policies

### Step 4: Check RLS Policies

Supabase Dashboard → Table Editor → `posts` → Policies

**Required Policies:**
1. **SELECT Policy**: "Posts are viewable by everyone" (should allow SELECT for authenticated users)
2. **INSERT Policy**: Users can insert their own posts
3. **UPDATE Policy**: Users can update their own posts

**Quick Fix if RLS is blocking:**
```sql
-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- Or create a permissive policy for testing
CREATE POLICY "Allow all for testing"
ON posts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

### Step 5: Check User Profile Exists

The white screen might be because the user doesn't have a profile:

```sql
-- Check if current user has a profile
SELECT * FROM profiles WHERE id = '[your-user-id]';
```

**If no profile exists:**
- The `handle_new_user` trigger should create one automatically
- Check if trigger exists: Supabase Dashboard → Database → Functions

**Manual Fix:**
```sql
-- Create profile for user (replace with actual user ID)
INSERT INTO profiles (id, name, email)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', email),
  email
FROM auth.users
WHERE id = '[user-id-from-console]'
ON CONFLICT (id) DO NOTHING;
```

### Step 6: Check Environment Variables

Verify Supabase is configured:

1. Check `.env.local` file exists
2. Check it contains:
   ```
   VITE_SUPABASE_URL=https://[your-project].supabase.co
   VITE_SUPABASE_ANON_KEY=[your-anon-key]
   ```
3. Restart dev server after adding/changing env vars

**Test if Supabase is configured:**
Open browser console and type:
```javascript
// Should show your Supabase URL
console.log(import.meta.env.VITE_SUPABASE_URL);
```

---

## Common Causes & Solutions

### Cause 1: RLS Policy Too Restrictive
**Symptom**: Console shows "Error loading posts" with 401 or permission denied

**Solution**: 
1. Check RLS policies in Supabase Dashboard
2. Ensure SELECT policy allows authenticated users
3. Test with permissive policy first, then tighten security

### Cause 2: Migration Not Applied
**Symptom**: Console shows error about `deleted_at` column not existing

**Solution**:
1. Apply migration `20251116120000_add_soft_delete_to_posts.sql`
2. Verify column exists: `SELECT deleted_at FROM posts LIMIT 1;`

### Cause 3: User Profile Missing
**Symptom**: Posts query works but user data is null

**Solution**:
1. Check if profile exists for user
2. Create profile manually if trigger didn't fire
3. Verify `handle_new_user` trigger exists

### Cause 4: Auth State Not Initialized
**Symptom**: Console shows "Auth initialization timeout" repeatedly

**Solution**:
1. Check Supabase connection (network tab)
2. Verify environment variables are correct
3. Check if Supabase project is active (not paused)

### Cause 5: Empty Posts Array Causing Render Issue
**Symptom**: White screen but console shows no errors

**Solution**: 
- ✅ Already fixed - Dashboard now handles empty posts gracefully
- Should show "No posts yet" message instead of white screen

---

## Quick Diagnostic Script

Run this in browser console to diagnose:

```javascript
// Check auth state
const { useAppContext } = await import('./src/contexts/AppContext.tsx');
// Actually, better to check directly:
console.log('Current user:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
// Or just check localStorage:
console.log('Supabase session:', localStorage.getItem('sb-[project]-auth-token'));

// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

---

## Next Steps After Fixing

Once white screen is resolved:

1. **Test Real-Time Updates** (Test 3):
   - Open app in Browser A
   - Open app in Browser B (different user or incognito)
   - Create post in Browser B
   - Should appear in Browser A without refresh

2. **Test Optimistic UI** (Test 4):
   - Disable network in DevTools
   - Create post → Should appear immediately
   - Re-enable network → Should sync

3. **Performance Tests** (Test 5-7):
   - Use Performance tab to measure load times
   - Check scroll FPS with 50+ posts
   - Test memory leaks

---

## Still Having Issues?

If white screen persists after checking all above:

1. **Share Console Logs**: Copy all console errors/warnings
2. **Share Network Tab**: Screenshot of failed requests
3. **Share Supabase Query Results**: Run the diagnostic query above
4. **Check Error Boundary**: Look for React error boundary messages

The enhanced logging should now show exactly where the failure is happening!

