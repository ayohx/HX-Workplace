# 🔧 Apply Soft Delete Migration - Quick Guide

## **Step-by-Step Instructions**

### **Option 1: Supabase Dashboard (Easiest)**

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/xbcwbzsgvmerkbnnplep
   ```

2. **Go to SQL Editor:**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy and paste this SQL:**
   ```sql
   -- Add deleted_at column to posts table
   ALTER TABLE public.posts
   ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone DEFAULT NULL;

   -- Create index for efficient filtering of deleted posts
   CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON public.posts (deleted_at) 
   WHERE deleted_at IS NOT NULL;

   -- Update RLS policy to exclude deleted posts from SELECT queries
   DROP POLICY IF EXISTS "Posts are viewable by everyone." ON public.posts;

   CREATE POLICY "Posts are viewable by everyone."
     ON public.posts FOR SELECT 
     USING (deleted_at IS NULL);
   ```

4. **Click "Run" button** (or press Cmd+Enter)

5. **Verify success:**
   - You should see "Success. No rows returned"
   - Check Table Editor → posts → you should see new `deleted_at` column

---

### **Option 2: Supabase CLI (If installed)**

```bash
cd "/Users/ayo.ogunrekun/Projects/HX Workplace"
supabase db push
```

---

## ✅ **Verification**

After running the migration:

1. Go to Table Editor → posts
2. Check if `deleted_at` column exists
3. It should be type: `timestamptz`, nullable: true

---

## 🎯 **What This Migration Does**

1. ✅ Adds `deleted_at` column for soft deletes
2. ✅ Creates index for performance
3. ✅ Updates RLS policy to hide deleted posts

**After this, your delete functionality will work properly!**

---

**Ready?** Apply the migration now, then tell me when it's done! ✅
