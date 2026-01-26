# 📖 API Quick Reference Guide

## Base URL
```
http://localhost:3000/api  (development)
https://your-domain.com/api  (production)
```

## Authentication

All endpoints (except `/plans`) require authentication via JWT token:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

Get token from Supabase auth:
```typescript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

---

## 📝 POST /api/generate-post

Generate a new LinkedIn post with all SaaS features.

### Request

```typescript
POST /api/generate-post
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "topic": "AI in SaaS",
  "audience": "Tech Founders",
  "tone": "Founder",  // Professional, Founder, Influencer, Casual
  "length": "Medium (200-300 words)",  // Short, Medium, Long
  "cta": "Share your thoughts",
  "templateId": "uuid-optional",  // Optional: Use specific template
  "teamId": "uuid-optional"       // Optional: Link to team
}
```

### Response

```typescript
{
  "post": "Generated post content...",
  "hashtags": "#AI #SaaS #TechFounders",
  "engagement": {
    "score": 85,
    "potential": "Excellent - High engagement potential"
  },
  "usage": {
    "promptTokens": 150,
    "completionTokens": 300,
    "totalTokens": 450
  },
  "cached": false,  // true if from cache
  "postId": "uuid",
  "versionNumber": 1
}
```

### Features
- ✅ Usage limit checking
- ✅ AI response caching (Pro+)
- ✅ Automatic version creation
- ✅ Hashtag intelligence
- ✅ Engagement scoring
- ✅ Template support

---

## 📊 GET /api/usage

Get current usage statistics and limits.

### Request

```bash
GET /api/usage
Authorization: Bearer YOUR_TOKEN
```

### Response

```typescript
{
  "daily": {
    "used": 5,
    "limit": 20,
    "remaining": 15
  },
  "monthly": {
    "used": 45,
    "limit": 500,
    "remaining": 455
  },
  "total": 127,
  "canGenerate": true,
  "reason": "OK"  // or "Daily limit reached..."
}
```

---

## 📋 GET /api/templates

Get all available prompt templates.

### Request

```bash
GET /api/templates
Authorization: Bearer YOUR_TOKEN
```

### Response

```typescript
{
  "templates": [
    {
      "id": "uuid",
      "role": "founder",
      "name": "Founder Voice",
      "description": "Authentic founder storytelling",
      "system_prompt": "You are a successful startup founder...",
      "user_prompt_template": "Write a LinkedIn post about {{topic}}...",
      "is_active": true,
      "is_default": true
    }
    // ... more templates
  ],
  "userTemplates": [
    // User's custom templates
  ]
}
```

---

## ➕ POST /api/templates

Create a custom template.

### Request

```typescript
POST /api/templates
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "name": "My Custom Template",
  "description": "My personal writing style",
  "systemPrompt": "You are a...",
  "userPromptTemplate": "Write about {{topic}} for {{audience}}..."
}
```

### Response

```typescript
{
  "id": "uuid",
  "role": "custom",
  "name": "My Custom Template",
  // ... full template object
}
```

---

## 🕐 GET /api/versions

Get version history for a post.

### Request

```bash
GET /api/versions?postId=POST_UUID
Authorization: Bearer YOUR_TOKEN
```

### Response

```typescript
{
  "versions": [
    {
      "id": "uuid",
      "post_id": "post-uuid",
      "version_number": 3,
      "content": "Latest version content...",
      "hashtags": "#AI #SaaS",
      "engagement_score": 85,
      "change_type": "regenerate",
      "created_at": "2026-01-26T10:00:00Z"
    },
    {
      "version_number": 2,
      // ... previous version
    },
    {
      "version_number": 1,
      // ... initial version
    }
  ],
  "currentVersion": 3,
  "totalVersions": 3
}
```

---

## ⏮️ POST /api/versions/rollback

Rollback to a previous version.

### Request

```typescript
POST /api/versions/rollback
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "postId": "post-uuid",
  "versionNumber": 2
}
```

### Response

```typescript
{
  "success": true,
  "message": "Rolled back to version 2"
}
```

---

## 💰 GET /api/plans

Get all subscription plans (public endpoint).

### Request

```bash
GET /api/plans
```

### Response

```typescript
{
  "plans": [
    {
      "id": "free",
      "name": "free",
      "display_name": "Free",
      "description": "Perfect for getting started",
      "price_monthly": 0,
      "price_yearly": 0,
      "daily_post_limit": 3,
      "monthly_post_limit": 30,
      "version_history_limit": 3,
      "hashtag_limit": 3,
      "team_members_limit": 1,
      "can_use_templates": false,
      "can_access_analytics": false,
      "can_use_ai_cache": false,
      "can_create_teams": false,
      "priority_support": false
    },
    // ... pro, creator, enterprise
  ]
}
```

---

## #️⃣ GET /api/hashtag-analysis

Get hashtag intelligence for a post.

### Request

```bash
GET /api/hashtag-analysis?postId=POST_UUID
Authorization: Bearer YOUR_TOKEN
```

### Response

```typescript
{
  "hashtags": [
    {
      "tag": "#AI",
      "category": "trending",
      "relevanceScore": 95,
      "estimatedReach": "high",
      "competitionLevel": "high"
    },
    {
      "tag": "#SaaS",
      "category": "broad",
      "relevanceScore": 88,
      "estimatedReach": "high",
      "competitionLevel": "medium"
    },
    {
      "tag": "#TechFounders",
      "category": "niche",
      "relevanceScore": 92,
      "estimatedReach": "medium",
      "competitionLevel": "low"
    }
  ],
  "summary": {
    "niche": 1,
    "broad": 1,
    "trending": 1,
    "branded": 0,
    "avgRelevance": 92,
    "highReach": 2,
    "mediumReach": 1,
    "lowReach": 0
  }
}
```

---

## ⚡ GET /api/cache-stats

Get AI cache statistics.

### Request

```bash
GET /api/cache-stats
Authorization: Bearer YOUR_TOKEN
```

### Response

```typescript
{
  "total": 150,           // Total cached entries
  "totalHits": 450,       // Total cache hits
  "avgHits": 3.0,         // Average hits per entry
  "savingsEstimate": 4.50 // Estimated savings in USD
}
```

---

## 🧹 POST /api/cache-stats/cleanup

Clean up expired cache entries (admin).

### Request

```bash
POST /api/cache-stats/cleanup
Authorization: Bearer YOUR_TOKEN
```

### Response

```typescript
{
  "success": true,
  "deleted": 25,
  "message": "Cleaned up 25 expired cache entries"
}
```

---

## Error Responses

### 401 Unauthorized
```typescript
{
  "error": "Unauthorized"
}
```

### 400 Bad Request
```typescript
{
  "error": "Missing required fields: topic, audience, tone, length, cta"
}
```

### 429 Too Many Requests
```typescript
{
  "error": "Usage limit reached",
  "message": "Daily limit reached. Upgrade your plan for more posts.",
  "usage": {
    "daily": {
      "used": 3,
      "limit": 3
    },
    "monthly": {
      "used": 30,
      "limit": 30
    }
  }
}
```

### 500 Internal Server Error
```typescript
{
  "error": "Failed to generate post",
  "message": "Detailed error message"
}
```

---

## Rate Limits

Limits are enforced per plan:

| Plan | Daily | Monthly |
|------|-------|---------|
| Free | 3 | 30 |
| Pro | 20 | 500 |
| Creator | 100 | 2,000 |
| Enterprise | 999 | 99,999 |

---

## Code Examples

### JavaScript/TypeScript

```typescript
// Generate a post
const response = await fetch('/api/generate-post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    topic: 'AI in SaaS',
    audience: 'Tech Founders',
    tone: 'Founder',
    length: 'Medium (200-300 words)',
    cta: 'Share your thoughts'
  })
});

const data = await response.json();
console.log(data.post);
console.log(`Engagement Score: ${data.engagement.score}`);
```

### cURL

```bash
# Generate a post
curl -X POST http://localhost:3000/api/generate-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "topic": "AI in SaaS",
    "audience": "Tech Founders",
    "tone": "Founder",
    "length": "Medium (200-300 words)",
    "cta": "Share your thoughts"
  }'

# Check usage
curl http://localhost:3000/api/usage \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get templates
curl http://localhost:3000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get plans (no auth required)
curl http://localhost:3000/api/plans
```

### Python

```python
import requests

# Generate a post
response = requests.post(
    'http://localhost:3000/api/generate-post',
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    },
    json={
        'topic': 'AI in SaaS',
        'audience': 'Tech Founders',
        'tone': 'Founder',
        'length': 'Medium (200-300 words)',
        'cta': 'Share your thoughts'
    }
)

data = response.json()
print(data['post'])
print(f"Engagement Score: {data['engagement']['score']}")
```

---

## Best Practices

### 1. Check Usage Before Generating
```typescript
const usage = await fetch('/api/usage', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const stats = await usage.json();

if (stats.canGenerate) {
  // Generate post
} else {
  // Show upgrade prompt
}
```

### 2. Handle Cache Hits
```typescript
const response = await generatePost(params);
if (response.cached) {
  console.log('✅ Instant result from cache!');
} else {
  console.log('🤖 Generated fresh content');
}
```

### 3. Use Templates for Consistency
```typescript
const templates = await fetch('/api/templates', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { templates: systemTemplates } = await templates.json();

// Use founder template
const founderTemplate = systemTemplates.find(t => t.role === 'founder');
```

### 4. Track Versions
```typescript
// After generating
const postId = response.postId;

// Later, get version history
const versions = await fetch(`/api/versions?postId=${postId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Webhooks (Future)

Ready for Stripe webhook integration:

```typescript
// POST /api/webhooks/stripe
// Handle subscription events:
// - customer.subscription.created
// - customer.subscription.updated
// - customer.subscription.deleted
```

---

**For complete documentation, see `PRODUCTION_SAAS_BACKEND.md`**
