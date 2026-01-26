# 🔄 Database Migration Guide

## Quick Setup

Follow these steps to set up the production-ready SaaS backend:

### Step 1: Run Base Schema (if not already done)

In your Supabase SQL Editor, run:

```sql
-- File: db/schema.sql
-- This creates the base tables: profiles, posts, drafts, usage
```

### Step 2: Run Enhanced Schema

In your Supabase SQL Editor, run:

```sql
-- File: db/enhanced-schema.sql
-- This adds all new SaaS features
```

This will create:
- ✅ Plans table with 4 tiers (free, pro, creator, enterprise)
- ✅ Prompt templates table
- ✅ Post versions table
- ✅ Hashtag intelligence table
- ✅ AI response cache table
- ✅ Teams & team members tables
- ✅ All necessary functions and triggers

### Step 3: Run RLS Policies

In your Supabase SQL Editor, run:

```sql
-- File: db/rls.sql (if not already done)
-- File: db/enhanced-rls.sql
```

This will:
- ✅ Enable Row Level Security on all tables
- ✅ Create policies for user data isolation
- ✅ Set up team access controls
- ✅ Protect sensitive data

### Step 4: Verify Installation

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'profiles', 'posts', 'drafts', 'usage',
  'plans', 'prompt_templates', 'post_versions',
  'hashtag_intelligence', 'ai_response_cache',
  'teams', 'team_members'
)
ORDER BY table_name;
```

You should see 11 tables.

### Step 5: Check Default Data

Verify plans were inserted:

```sql
SELECT id, display_name, daily_post_limit, monthly_post_limit 
FROM plans 
ORDER BY price_monthly;
```

You should see 4 plans: free, pro, creator, enterprise.

Verify templates were inserted:

```sql
SELECT role, name, is_default 
FROM prompt_templates 
WHERE is_active = true
ORDER BY role;
```

You should see 5 default templates.

---

## Migration Notes

### Existing Data

If you have existing data:

1. **Existing posts**: Will continue to work
2. **Existing users**: Will automatically get `free` plan
3. **Usage tracking**: Will be initialized for existing users

### Breaking Changes

⚠️ **None** - This is a backward-compatible migration.

All new columns have defaults, so existing functionality continues to work.

### New Features Enabled

After migration, you'll have:

1. ✅ Usage limits enforced
2. ✅ Version history for all new posts
3. ✅ AI caching (Pro+ plans)
4. ✅ Hashtag intelligence
5. ✅ Engagement scoring
6. ✅ Template system
7. ✅ Team workspace foundation

---

## Rollback (if needed)

If you need to rollback, run:

```sql
-- Drop new tables (in reverse order due to foreign keys)
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS ai_response_cache CASCADE;
DROP TABLE IF EXISTS hashtag_intelligence CASCADE;
DROP TABLE IF EXISTS post_versions CASCADE;
DROP TABLE IF EXISTS prompt_templates CASCADE;
DROP TABLE IF EXISTS plans CASCADE;

-- Remove new columns from existing tables
ALTER TABLE posts DROP COLUMN IF EXISTS team_id;
ALTER TABLE posts DROP COLUMN IF EXISTS template_id;
ALTER TABLE posts DROP COLUMN IF EXISTS is_cached;
ALTER TABLE posts DROP COLUMN IF EXISTS cache_hit;

ALTER TABLE usage DROP COLUMN IF EXISTS posts_generated_this_month;
ALTER TABLE usage DROP COLUMN IF EXISTS month_reset;
```

⚠️ **Warning**: This will delete all data in the new tables!

---

## Testing the Migration

### Test 1: Create a Post

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

Expected: Post created with version 1, engagement score, and hashtag intelligence.

### Test 2: Check Usage

```bash
curl http://localhost:3000/api/usage \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Daily and monthly usage stats.

### Test 3: Get Templates

```bash
curl http://localhost:3000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: 5 default templates.

### Test 4: Get Plans

```bash
curl http://localhost:3000/api/plans
```

Expected: 4 plans (free, pro, creator, enterprise).

---

## Performance Considerations

### Indexes Created

The migration creates indexes on:
- `plans(id)` - Primary key
- `prompt_templates(role, is_active)` - Template lookups
- `post_versions(post_id, version_number)` - Version queries
- `hashtag_intelligence(post_id, category)` - Hashtag analysis
- `ai_response_cache(cache_key, expires_at)` - Cache lookups
- `teams(owner_id, slug)` - Team queries
- `team_members(team_id, user_id)` - Membership queries
- `posts(team_id, template_id)` - Post queries

### Expected Performance

- Post generation: ~2-5 seconds (first time)
- Post generation: ~500ms (cached)
- Version history: ~100ms
- Usage check: ~50ms
- Template lookup: ~50ms

---

## Monitoring

### Cache Hit Rate

```sql
SELECT 
  COUNT(*) as total_cached,
  SUM(hit_count) as total_hits,
  AVG(hit_count) as avg_hits_per_entry,
  SUM(hit_count) * 0.01 as estimated_savings_usd
FROM ai_response_cache;
```

### Usage by Plan

```sql
SELECT 
  p.plan,
  COUNT(*) as users,
  AVG(u.posts_generated_today) as avg_daily_posts,
  AVG(u.total_posts_generated) as avg_total_posts
FROM profiles p
JOIN usage u ON p.id = u.user_id
GROUP BY p.plan
ORDER BY p.plan;
```

### Version History Stats

```sql
SELECT 
  COUNT(DISTINCT post_id) as posts_with_versions,
  AVG(version_count) as avg_versions_per_post,
  MAX(version_count) as max_versions
FROM (
  SELECT post_id, COUNT(*) as version_count
  FROM post_versions
  GROUP BY post_id
) subquery;
```

---

## Support

If you encounter issues:

1. Check Supabase logs for errors
2. Verify all environment variables are set
3. Ensure RLS policies are enabled
4. Check that triggers are active

For questions, refer to `PRODUCTION_SAAS_BACKEND.md` for detailed documentation.
