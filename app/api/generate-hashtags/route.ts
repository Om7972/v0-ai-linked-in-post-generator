import { generateText } from "ai"

export const maxDuration = 30

interface HashtagRequest {
  postContent: string
}

export async function POST(req: Request) {
  try {
    const { postContent }: HashtagRequest = await req.json()

    const { text } = await generateText({
      model: "google/gemini-2.5-flash",
      prompt: `Analyze the following LinkedIn post text and provide 5 highly relevant and trending hashtags separated by spaces, with no other text or explanation. Just return the hashtags with # symbols:

${postContent}`,
      maxOutputTokens: 100,
      temperature: 0.3,
    })

    // Clean up the response to ensure we only get hashtags
    const hashtags = text
      .trim()
      .split(/\s+/)
      .filter((tag) => tag.startsWith("#"))
      .slice(0, 5)

    return Response.json({
      hashtags: hashtags.join(" "),
    })
  } catch (error) {
    console.error("Error generating hashtags:", error)
    return Response.json({ error: "Failed to generate hashtags. Please try again." }, { status: 500 })
  }
}
