import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { userProfile, matchProfile } = await req.json()

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

