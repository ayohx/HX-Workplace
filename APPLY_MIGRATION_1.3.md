# 🔧 Apply Story 1.3 Migration - Quick Guide

## What This Migration Does

Adds support for:
- **Comment Threading**: Reply to comments (up to 3 levels)
- **GIPHY Reactions**: Animated GIF reactions

---

## ⚡ Quick Steps (5 minutes)

### 1. Open Supabase Dashboard

Go to: https://supabase.com/dashboard

### 2. Select Your Project

Click on: **HX Workplace**

### 3. Open SQL Editor

Click **SQL Editor** in the left sidebar

### 4. Create New Query

Click the **New Query** button

### 5. Copy & Paste This SQL

```sql
-- Add comment threading support (replies to comments)
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- Index for efficient parent comment lookups
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments (parent_id);

-- Add GIPHY support for reactions
ALTER TABLE public.reactions
ADD COLUMN IF NOT EXISTS giphy_id text,
ADD COLUMN IF NOT EXISTS giphy_url text;

-- Index for GIPHY lookups
CREATE INDEX IF NOT EXISTS idx_reactions_giphy_id ON public.reactions (giphy_id)
WHERE giphy_id IS NOT NULL;
```

### 6. Run the Query

Click **Run** or press `Cmd + Enter` (Mac) / `Ctrl + Enter` (Windows)

### 7. Verify Success

You should see: **"Success. No rows returned"**

---

## ✅ Done!

Your database now supports:
- ✅ Comment threading (replies)
- ✅ GIPHY reactions

---

## 🎬 Optional: Set Up GIPHY

### Get Free API Key:

1. Go to: https://developers.giphy.com/
2. Click **Create an App**
3. Select **API** (not SDK)
4. Fill in:
   - App Name: **HX Workplace**
   - Description: **Social feed reactions**
5. Click **Create App**
6. Copy your **API Key**

### Add to Your Project:

1. Open `.env.local` in your project
2. Add this line:

```env
VITE_GIPHY_API_KEY=paste_your_key_here
```

3. **Restart your dev server:**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Test It!

1. Go to: http://localhost:5173
2. Login with your test account
3. Try the new features:
   - Click the Like button → See 5 reaction options
   - Click "GIF Reaction" → Search for GIFs
   - Add a comment → Reply to it
   - Edit your comment → Delete it

---

## 🐛 Troubleshooting

### "Column already exists" error?
✅ **Good news!** Migration already applied, you're all set!

### GIPHY not working?
- Check API key is in `.env.local`
- Restart dev server after adding key
- Check browser console for errors

### Comments not appearing?
- Verify Supabase connection: http://localhost:5173/test-supabase
- Check you're logged in
- Check browser console for errors

---

## 🎉 You're Ready!

Migration applied successfully! Now you can:
- ✅ Reply to comments
- ✅ Use 5 reaction types
- ✅ Search and post GIFs
- ✅ Edit and delete comments

**Let's test Story 1.3!** 🚀
