import { generateText } from "ai"

export const maxDuration = 30

interface RefineRequest {
  currentPost: string
  refinementType: string
  customInstruction?: string
}

export async function POST(req: Request) {
  try {
    const { currentPost, refinementType, customInstruction }: RefineRequest = await req.json()

    let refinementPrompt = ""

    switch (refinementType) {
      case "urgent":
        refinementPrompt =
          "Make this LinkedIn post sound more urgent and compelling. Maintain the same core message but add urgency and immediacy to the tone."
        break
      case "example":
        refinementPrompt =
          "Add another concrete example or case study to this LinkedIn post to make it more engaging and relatable."
        break
      case "shorten":
        refinementPrompt =
          "Shorten this LinkedIn post by approximately 50 words while maintaining all key points and the call to action."
        break
      case "custom":
        refinementPrompt = customInstruction || "Improve this LinkedIn post"
        break
      default:
        refinementPrompt = "Improve this LinkedIn post to make it more engaging and professional."
    }

    const { text } = await generateText({
      model: "google/gemini-2.5-flash",
      prompt: `${refinementPrompt}

Current post:
${currentPost}

Please provide the refined version:`,
      maxOutputTokens: 2000,
      temperature: 0.7,
    })

    return Response.json({
      refinedPost: text.trim(),
    })
  } catch (error) {
    console.error("Error refining post:", error)
    return Response.json({ error: "Failed to refine post. Please try again." }, { status: 500 })
  }
}
