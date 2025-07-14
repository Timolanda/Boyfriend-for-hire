import { NextResponse } from "next/server"
import OpenAI from "openai"

// Only initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(req: Request) {
  const { userProfile, matchProfile } = await req.json()

  // Check if OpenAI is available
  if (!openai) {
    return NextResponse.json({ 
      error: "OpenAI API not configured",
      conversationStarters: [
        "What's your favorite way to spend a weekend?",
        "Have you been to any interesting places recently?",
        "What's something you're passionate about?",
        "What's the best meal you've ever had?",
        "What's a skill you'd love to learn?"
      ]
    }, { status: 503 })
  }

  const prompt = `
    Given the following user profiles:
    User: ${JSON.stringify(userProfile)}
    Match: ${JSON.stringify(matchProfile)}

    Generate 5 engaging and personalized conversation starters that would be appropriate for a first date or initial conversation. These should be based on their shared interests, experiences, or potential complementary traits. Each starter should be 1-2 sentences long.

    Return the results as a JSON array of strings.
  `

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    })

    const conversationStarters = JSON.parse(completion.choices[0].message.content || "[]")

    return NextResponse.json({ conversationStarters })
  } catch (error) {
    console.error("Error generating conversation starters:", error)
    return NextResponse.json({ error: "Failed to generate conversation starters" }, { status: 500 })
  }
}

