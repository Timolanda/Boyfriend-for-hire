import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { userPreferences, userProfile } = await req.json()

  const prompt = `
    Given the following user preferences and profile:
    User Preferences: ${JSON.stringify(userPreferences)}
    User Profile: ${JSON.stringify(userProfile)}

    Generate 5 potential matches with the following information for each:
    - Name
    - Age
    - Bio (2-3 sentences)
    - Interests (list of 3-5)
    - Compatibility score (0-100)
    - Reason for match (1-2 sentences)

    Return the results as a JSON array.
  `

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    })

    const matches = JSON.parse(completion.choices[0].message.content || "[]")

    return NextResponse.json({ matches })
  } catch (error) {
    console.error("Error in AI matchmaking:", error)
    return NextResponse.json({ error: "Failed to generate matches" }, { status: 500 })
  }
}

