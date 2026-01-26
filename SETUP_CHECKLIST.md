# ✅ Setup Checklist - Get Your SaaS Backend Running

Follow this checklist to get your production-ready SaaS backend up and running!

---

## 📋 Pre-Deployment Checklist

### ☐ 1. Database Setup

#### Step 1.1: Run Base Schema
```sql
-- In Supabase SQL Editor, run:
-- File: db/schema.sql
```

**Verify**: Check that these tables exist:
- `profiles`
- `posts`
- `drafts`
- `usage`

#### Step 1.2: Run Enhanced Schema
```sql
-- In Supabase SQL Editor, run:
-- File: db/enhanced-schema.sql
```

**Verify**: Check that these tables exist:
- `plans`
- `prompt_templates`
- `post_versions`
- `hashtag_intelligence`
- `ai_response_cache`
- `teams`
- `team_members`

#### Step 1.3: Run RLS Policies
```sql
-- In Supabase SQL Editor, run:
-- File: db/rls.sql (if not already done)
-- File: db/enhanced-rls.sql
```

**Verify**: Run this query:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

You should see 11 tables with RLS enabled.

#### Step 1.4: Verify Default Data
```sql
-- Check plans
SELECT id, display_name, daily_post_limit 
FROM plans 
ORDER BY price_monthly;
```

Expected: 4 plans (free, pro, creator, enterprise)

```sql
-- Check templates
SELECT role, name 
FROM prompt_templates 
WHERE is_active = true;
```

Expected: 5 templates (founder, recruiter, influencer, marketer, professional)

---

### ☐ 2. Environment Variables

Check your `.env.local` file has all required variables:

```env
# AI
✓ GEMINI_API_KEY=your_key_here

# Supabase
✓ NEXT_PUBLIC_SUPABASE_URL=your_url_here
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
✓ SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Test**: Run this command to verify:
```bash
node -e "console.log(process.env.GEMINI_API_KEY ? '✓ GEMINI_API_KEY set' : '✗ GEMINI_API_KEY missing')"
```

---

### ☐ 3. Dependencies

Ensure all packages are installed:

```bash
npm install
```

**Verify**: Check that these packages exist in `node_modules`:
- `@supabase/supabase-js`
- `@supabase/ssr`
- `@google/generative-ai`
- `next`
- `react`
- `typescript`

---

### ☐ 4. Development Server

Start the development server:

```bash
npm run dev
```

**Verify**: Visit `http://localhost:3000` and check that the app loads without errors.

---

### ☐ 5. API Testing

Test each endpoint to ensure everything works:

#### Test 1: Plans (Public)
```bash
curl http://localhost:3000/api/plans
```

**Expected**: JSON with 4 plans

#### Test 2: Usage (Authenticated)
```bash
# Replace YOUR_TOKEN with actual JWT token
curl http://localhost:3000/api/usage \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: JSON with daily/monthly usage stats

#### Test 3: Templates (Authenticated)
```bash
curl http://localhost:3000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: JSON with templates array

#### Test 4: Generate Post (Authenticated)
```bash
curl -X POST http://localhost:3000/api/generate-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "topic": "Test Topic",
    "audience": "Developers",
    "tone": "Professional",
    "length": "Medium (200-300 words)",
    "cta": "Share your thoughts"
  }'
```

**Expected**: JSON with generated post, hashtags, engagement score

---

### ☐ 6. Database Verification

Run these queries to verify data is being created:

#### Check Usage Tracking
```sql
SELECT user_id, posts_generated_today, posts_generated_this_month 
FROM usage 
LIMIT 5;
```

#### Check Posts
```sql
SELECT id, topic, tone, engagement_score, created_at 
FROM posts 
ORDER BY created_at DESC 
LIMIT 5;
```

#### Check Versions
```sql
SELECT post_id, version_number, change_type, created_at 
FROM post_versions 
ORDER BY created_at DESC 
LIMIT 5;
```

#### Check Hashtag Intelligence
```sql
SELECT post_id, hashtag, category, relevance_score 
FROM hashtag_intelligence 
ORDER BY created_at DESC 
LIMIT 10;
```

---

### ☐ 7. Feature Testing

Test each major feature:

#### ✓ Usage Limits
1. Generate posts until you hit the limit
2. Verify you get a 429 error
3. Check that `canGenerate` is false in `/api/usage`

#### ✓ Version History
1. Generate a post (version 1)
2. Regenerate the same post (version 2)
3. Call `/api/versions?postId=xxx`
4. Verify you see 2 versions
5. Rollback to version 1
6. Verify content changed

#### ✓ Templates
1. Call `/api/templates`
2. Get a template ID
3. Generate a post with `templateId` parameter
4. Verify template was used

#### ✓ Engagement Scoring
1. Generate a post
2. Check `engagement.score` in response
3. Verify score is between 0-100

#### ✓ Hashtag Intelligence
1. Generate a post
2. Call `/api/hashtag-analysis?postId=xxx`
3. Verify hashtags are categorized

#### ✓ AI Caching (Pro+ only)
1. Generate a post with specific parameters
2. Generate again with EXACT same parameters
3. Second response should have `cached: true`
4. Check `/api/cache-stats` for hit count

---

### ☐ 8. Security Testing

Verify security is working:

#### Test RLS
```bash
# Try to access another user's data (should fail)
# This should return empty or error
```

#### Test Authentication
```bash
# Try to call API without token (should fail)
curl http://localhost:3000/api/usage
```

**Expected**: 401 Unauthorized

#### Test Authorization
```bash
# Try to access data you don't own (should fail)
```

---

### ☐ 9. Performance Testing

#### Check Database Indexes
```sql
SELECT 
  tablename, 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

**Expected**: 15+ indexes

#### Check Cache Performance
```sql
SELECT 
  COUNT(*) as total_entries,
  SUM(hit_count) as total_hits,
  AVG(hit_count) as avg_hits
FROM ai_response_cache;
```

---

### ☐ 10. Documentation Review

Ensure you've read:

- ✓ [README.md](./README.md) - Project overview
- ✓ [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - What was built
- ✓ [PRODUCTION_SAAS_BACKEND.md](./PRODUCTION_SAAS_BACKEND.md) - Full documentation
- ✓ [API_REFERENCE.md](./API_REFERENCE.md) - API endpoints
- ✓ [DATABASE_MIGRATION_GUIDE.md](./DATABASE_MIGRATION_GUIDE.md) - Database setup

---

## 🚀 Deployment Checklist

### ☐ 1. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### ☐ 2. Environment Variables in Vercel

Add these in Vercel dashboard:
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### ☐ 3. Production Testing

After deployment, test all endpoints on production URL:

```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/api/plans
```

---

## 🎯 Post-Deployment

### ☐ 1. Monitor Performance

Set up monitoring for:
- API response times
- Database query performance
- Cache hit rates
- Error rates

### ☐ 2. Set Up Alerts

Configure alerts for:
- High error rates
- Slow API responses
- Database connection issues
- High AI API costs

### ☐ 3. Regular Maintenance

Schedule regular tasks:
- Clean up expired cache (weekly)
- Review usage patterns (monthly)
- Update plans/pricing (as needed)
- Backup database (daily)

---

## 📊 Success Criteria

Your backend is ready when:

- ✅ All 11 database tables exist
- ✅ All 4 functions are created
- ✅ RLS is enabled on all tables
- ✅ All 9 API endpoints work
- ✅ Authentication is required
- ✅ Usage limits are enforced
- ✅ Versions are auto-created
- ✅ Engagement scores are calculated
- ✅ Hashtags are categorized
- ✅ AI caching works (Pro+)
- ✅ All tests pass
- ✅ Documentation is complete

---

## 🆘 Troubleshooting

### Issue: "Missing authorization header"
**Solution**: Ensure you're sending `Authorization: Bearer TOKEN` header

### Issue: "Usage limit reached"
**Solution**: This is expected! Upgrade plan or wait for daily reset

### Issue: "Failed to generate post"
**Solution**: Check Gemini API key is valid and has quota

### Issue: "Table does not exist"
**Solution**: Run database migration scripts in order

### Issue: "RLS policy violation"
**Solution**: Ensure RLS policies are created correctly

---

## 🎉 You're Done!

When all checkboxes are checked, your production-ready SaaS backend is live!

**Next Steps**:
1. Build the landing page (see `LANDING_PAGE_PLAN.md`)
2. Integrate Stripe for payments
3. Add analytics dashboard
4. Launch to users! 🚀

---

**Need help?** Check the documentation or review the code comments.

**Ready to scale!** 🚀
