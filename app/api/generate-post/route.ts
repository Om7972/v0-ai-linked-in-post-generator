import { generateText } from "ai"

export const maxDuration = 30

interface PostRequest {
  topic: string
  audience: string
  tone: string
  length: string
  cta: string
  grounding: boolean
}

export async function POST(req: Request) {
  try {
    const { topic, audience, tone, length, cta, grounding }: PostRequest = await req.json()

    // Construct system instruction based on the workflow
    const systemInstruction = `Act as a world-class professional copywriter specializing in LinkedIn content. Your posts must be highly engaging, use appropriate emojis sparingly, and utilize strategic line breaks to maximize readability on mobile devices. Ensure the first sentence is a compelling hook. Include a clear call to action at the end.

Key guidelines:
- Write in a ${tone} tone
- Target audience: ${audience}
- Length should be ${length}
- Use strategic line breaks for mobile readability
- Include relevant emojis but use them sparingly
- Make the first sentence a compelling hook
- End with the specified call to action
- Format for LinkedIn's algorithm optimization`

    // Construct user query based on the workflow template
    const userQuery = `Generate a LinkedIn post about the following key message: ${topic}. The target audience is ${audience}. Adopt a ${tone} tone, and make it approximately ${length} length. The post must conclude with this specific call to action: ${cta}.`

    // Configure the API call
    const config: any = {
      model: "google/gemini-2.5-flash",
      system: systemInstruction,
      prompt: userQuery,
      maxOutputTokens: 2000,
      temperature: 0.7,
    }

    // Add Google Search grounding if requested
    if (grounding) {
      config.tools = [{ googleSearch: {} }]
    }

    const { text, usage, finishReason } = await generateText(config)

    return Response.json({
      post: text,
      usage,
      finishReason,
      grounded: grounding,
    })
  } catch (error) {
    console.error("Error generating post:", error)
    return Response.json({ error: "Failed to generate post. Please try again." }, { status: 500 })
  }
}
