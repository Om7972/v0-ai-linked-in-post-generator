import { NextRequest, NextResponse } from "next/server";
import { generateLinkedInPost, generateHashtags } from "@/lib/ai-service";

export const maxDuration = 30;

interface PostRequest {
  topic: string;
  audience: string;
  tone: string;
  length: string;
  cta: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, audience, tone, length, cta }: PostRequest = body;

    // Validate input
    if (!topic || !audience || !tone || !length || !cta) {
      return NextResponse.json(
        { error: "Missing required fields: topic, audience, tone, length, cta" },
        { status: 400 }
      );
    }

    // Map frontend tone values to backend enum
    const toneMap: Record<string, "professional" | "founder" | "influencer" | "casual"> = {
      "Professional": "professional",
      "Founder": "founder", 
      "Influencer": "influencer",
      "Casual": "casual"
    };
    
    const mappedTone = toneMap[tone] || "professional";
    
    // Map frontend length values to backend enum
    const lengthMap: Record<string, "short" | "medium" | "long"> = {
      "Short (100-150 words)": "short",
      "Medium (200-300 words)": "medium",
      "Long (350-500 words)": "long"
    };
    
    const mappedLength = lengthMap[length] || "medium";

    // Generate post using Gemini
    const generatedPost = await generateLinkedInPost({
      topic,
      audience,
      tone: mappedTone,
      length: mappedLength,
      cta
    });

    if (!generatedPost.content) {
      return NextResponse.json(
        { 
          error: "Failed to generate post content",
          message: "The AI service returned empty content",
          details: "This might indicate an issue with the API request or content filtering"
        },
        { status: 500 }
      );
    }

    // Validate content quality
    const wordCount = generatedPost.content.split(/\s+/).filter(word => word.length > 0).length;
    const charCount = generatedPost.content.length;
    
    console.log("Content validation:", {
      wordCount,
      charCount,
      tone: mappedTone,
      length: mappedLength
    });
    
    // Basic content quality checks
    if (wordCount < 20) {
      console.warn("Generated content seems too short:", wordCount, "words");
    }
    
    if (charCount < 50) {
      console.warn("Generated content seems too brief:", charCount, "characters");
    }

    // Generate hashtags using Gemini
    const hashtags = await generateHashtags(generatedPost.content);

    // Calculate engagement score
    const engagementScore = calculateEngagementScore(generatedPost.content, hashtags);

    return NextResponse.json({
      post: generatedPost.content,
      hashtags,
      engagement: {
        score: engagementScore,
        potential: getEngagementPotential(engagementScore),
      },
      usage: generatedPost.usage
    });
  } catch (error: any) {
    console.error("Error generating post:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });

    // Enhanced error categorization
    if (error.message?.includes("API key") || error.message?.includes("AUTHENTICATION_FAILED")) {
      return NextResponse.json(
        { 
          error: "API configuration error", 
          message: "Invalid or missing API key configuration",
          details: "Check GEMINI_API_KEY or GROQ_API_KEY in your environment variables"
        },
        { status: 500 }
      );
    }

    if (error.message?.includes("quota") || error.message?.includes("RATE_LIMIT")) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          message: error.message,
          details: "Please try again later or upgrade your API plan"
        },
        { status: 429 }
      );
    }

    if (error.message?.includes("safety") || error.message?.includes("SAFETY")) {
      return NextResponse.json(
        { 
          error: "Content safety violation",
          message: "Content was blocked by safety filters",
          details: "Try adjusting your topic or content request"
        },
        { status: 400 }
      );
    }

    if (error.message?.includes("INVALID_ARGUMENT")) {
      return NextResponse.json(
        { 
          error: "Invalid request",
          message: "Invalid parameters provided",
          details: "Check your request format and parameters"
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Failed to generate post",
        message: error.message || "An unexpected error occurred during content generation",
        details: "The AI service encountered an issue. Please try again or contact support if the problem persists."
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate engagement score
 */
function calculateEngagementScore(content: string, hashtags: string): number {
  let score = 50;
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 150 && wordCount <= 300) score += 20;
  else if (wordCount >= 100 && wordCount <= 400) score += 10;

  const charCount = content.length;
  if (charCount <= 3000) score += 10;

  const lineBreaks = (content.match(/\n/g) || []).length;
  if (lineBreaks >= 3) score += 10;
  else if (lineBreaks >= 1) score += 5;

  const hashtagCount = (hashtags.match(/#\w+/g) || []).length;
  if (hashtagCount >= 3 && hashtagCount <= 5) score += 10;

  const questionMarks = (content.match(/\?/g) || []).length;
  if (questionMarks >= 1) score += 5;

  const ctaWords = ["comment", "share", "thoughts", "experience", "opinion", "agree", "disagree", "let me know"];
  const hasCTA = ctaWords.some((word) => content.toLowerCase().includes(word));
  if (hasCTA) score += 5;

  return Math.min(score, 100);
}

/**
 * Get engagement potential description
 */
function getEngagementPotential(score: number): string {
  if (score >= 80) return "Excellent - High engagement potential";
  if (score >= 60) return "Good - Solid engagement potential";
  if (score >= 40) return "Fair - Moderate engagement potential";
  return "Needs improvement - Low engagement potential";
}