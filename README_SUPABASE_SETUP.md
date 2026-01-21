# Supabase Backend Setup Guide

This guide will help you set up the production-ready Supabase backend for the AI LinkedIn Post Generator.

## 📋 Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Supabase project created
3. Your Supabase project credentials

## 🔧 Step 1: Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Optional: JWT Secret (if you still need it for legacy code)
JWT_SECRET=your-jwt-secret
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to Settings → API
- Copy the `URL` (for `NEXT_PUBLIC_SUPABASE_URL`)
- Copy the `anon` `public` key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Copy the `service_role` `secret` key (for `SUPABASE_SERVICE_ROLE_KEY`)

## 🗄️ Step 2: Database Setup

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the schema file first:
   - Copy the contents of `db/schema.sql`
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. Then run the RLS policies:
   - Copy the contents of `db/rls.sql`
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter

## ✅ Step 3: Verify Setup

After running the SQL files, verify that:

1. **Tables are created:**
   - Go to Table Editor in Supabase
   - You should see: `profiles`, `posts`, `drafts`, `usage`

2. **RLS is enabled:**
   - Click on each table
   - Check that "Enable RLS" is toggled ON

3. **Policies are active:**
   - In each table, go to the "Policies" tab
   - You should see policies for SELECT, INSERT, UPDATE, DELETE

## 🔐 Step 4: Authentication Setup

The backend uses Supabase Auth. To enable authentication:

1. **Enable Email Auth:**
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email templates if needed

2. **Optional: Enable other providers:**
   - Google OAuth
   - GitHub OAuth
   - etc.

## 🚀 Step 5: Test the API

You can test the API endpoints using curl or Postman:

```bash
# 1. Sign up a user (via Supabase Auth)
# 2. Get the access token from the auth response
# 3. Use it in API calls:

curl -X POST http://localhost:3000/api/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI in 2024",
    "audience": "tech professionals",
    "tone": "professional",
    "length": "medium",
    "cta": "What are your thoughts?"
  }'
```

## 📊 Database Schema Overview

### `profiles`
- Extends Supabase `auth.users`
- Stores user plan (free, pro, creator, enterprise)
- Auto-created when user signs up

### `posts`
- Stores generated LinkedIn posts
- Linked to user via `user_id`
- Includes engagement score, hashtags, etc.

### `drafts`
- Stores draft posts
- Allows saving work in progress

### `usage`
- Tracks daily usage limits
- Auto-resets daily
- Enforces plan-based limits

## 🔒 Security Features

1. **Row Level Security (RLS):**
   - Users can only access their own data
   - Enforced at the database level

2. **API Key Security:**
   - Gemini API key never exposed to client
   - Service role key only used server-side

3. **Rate Limiting:**
   - Daily limits per subscription plan
   - Automatic reset at midnight UTC

## 📈 Usage Limits

| Plan | Daily Limit |
|------|-------------|
| Free | 5 posts |
| Pro | 50 posts |
| Creator | 200 posts |
| Enterprise | 1000 posts |

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check that all env variables are set in `.env.local`
- Restart your dev server after adding env variables

### "User profile not found"
- Make sure you ran `db/schema.sql` completely
- Check that the trigger `on_auth_user_created` is created

### "RLS policy violation"
- Verify that RLS policies are enabled
- Check that you're authenticated (have a valid session)

### "Daily limit exceeded"
- Check your current plan in the `profiles` table
- Wait for the daily reset (midnight UTC)
- Or upgrade your plan

## 🔄 Migration from In-Memory Storage

If you're migrating from the previous in-memory storage:

1. The old API routes will continue to work
2. New routes use Supabase:
   - `/api/generate` (new)
   - `/api/posts` (updated)
   - `/api/usage` (new)

3. Update your frontend to use Supabase Auth instead of JWT tokens

## 📚 Next Steps

1. Update frontend authentication to use Supabase Auth
2. Test all API endpoints
3. Set up monitoring and logging
4. Configure production environment variables in Vercel

## 🆘 Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Check Next.js server logs
3. Verify all environment variables are set correctly
4. Ensure database schema and RLS policies are applied

