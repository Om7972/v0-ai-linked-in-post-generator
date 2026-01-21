# Migration Guide: From In-Memory to Supabase

This guide helps you migrate from the current in-memory storage to the production-ready Supabase backend.

## 🔄 What's Changing

### API Routes

**Old routes (still work, but deprecated):**
- `/api/generate-post` → Use `/api/generate` instead
- `/api/generate-hashtags` → Use `/api/generate/hashtags` instead
- `/api/refine-post` → Use `/api/generate/refine` instead
- `/api/posts` → Updated to use Supabase
- `/api/user/stats` → Will need to be updated
- `/api/user/profile` → Will need to be updated

**New routes:**
- `POST /api/generate` - Generate LinkedIn post (with usage limits)
- `GET /api/posts` - Get user's posts (with pagination)
- `GET /api/usage` - Get usage status

### Authentication

**Old:** JWT tokens stored in localStorage
**New:** Supabase Auth with session management

## 📝 Step-by-Step Migration

### 1. Set Up Supabase

Follow `README_SUPABASE_SETUP.md` to:
- Create Supabase project
- Run database schema
- Configure environment variables

### 2. Update Frontend Authentication

Replace JWT-based auth with Supabase Auth:

```typescript
// Old (JWT)
import { useAuth } from "@/hooks/use-auth"

// New (Supabase)
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const supabase = createClientSupabaseClient()

// Sign up
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { name }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

// Get session
const { data: { session } } = await supabase.auth.getSession()

// Sign out
await supabase.auth.signOut()
```

### 3. Update API Calls

**Old:**
```typescript
const response = await fetch("/api/generate-post", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data),
})
```

**New:**
```typescript
const { data: { session } } = await supabase.auth.getSession()

const response = await fetch("/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token}`,
  },
  body: JSON.stringify(data),
})
```

### 4. Update Generate Page

The generate page needs to:
1. Use Supabase session instead of JWT
2. Call `/api/generate` instead of `/api/generate-post`
3. Handle usage limit errors (429 status)

### 5. Update Dashboard

The dashboard should:
1. Fetch posts from `/api/posts` (now with pagination)
2. Use Supabase Auth for user info
3. Display usage status from `/api/usage`

## 🔧 Compatibility Mode

The old API routes still exist for backward compatibility:
- `/api/generate-post` - Redirects to `/api/generate`
- `/api/generate-hashtags` - Redirects to `/api/generate/hashtags`
- `/api/refine-post` - Redirects to `/api/generate/refine`

## ⚠️ Breaking Changes

1. **Authentication:** Must use Supabase Auth, JWT tokens won't work
2. **API Response Format:** Some endpoints return slightly different formats
3. **Error Codes:** New 429 status for rate limiting
4. **Usage Limits:** Now enforced at API level

## ✅ Testing Checklist

- [ ] User can sign up with Supabase Auth
- [ ] User can sign in
- [ ] User can generate posts (within limit)
- [ ] Usage limit is enforced (429 error)
- [ ] Posts are saved to Supabase
- [ ] Dashboard shows user's posts
- [ ] User can delete posts
- [ ] Usage status is accurate
- [ ] Daily reset works correctly

## 🐛 Common Issues

### "Unauthorized" errors
- Make sure you're passing the Supabase session token
- Check that RLS policies are set up correctly

### "Daily limit exceeded" immediately
- Check user's plan in `profiles` table
- Verify usage counter is resetting correctly

### Posts not saving
- Check Supabase logs for errors
- Verify RLS policies allow INSERT
- Check that user_id matches authenticated user

## 📚 Next Steps

After migration:
1. Remove old JWT auth code
2. Remove in-memory storage (`lib/user-posts.ts`)
3. Update all API calls to use new endpoints
4. Test thoroughly in staging
5. Deploy to production

