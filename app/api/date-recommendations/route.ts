import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { userProfile, matchProfile, userPreferences } = await req.json()

  const prompt = `
    Given the following user profile, match profile, and user preferences:
    User Profile: ${JSON.stringify(userProfile)}
    Match Profile: ${JSON.stringify(matchProfile)}
    User Preferences: ${JSON.stringify(userPreferences)}

    Generate 3 personalized date recommendations with the following information for each:
    - Date idea (1 sentence)
    - Description (2-3 sentences)
    - Why it's a good fit (1-2 sentences)
    - Estimated cost ($ to $$$$$)

    Return the results as a JSON array.
  `

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    })

    const recommendations = JSON.parse(completion.choices[0].message.content || "[]")

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error in date recommendations:", error)
    return NextResponse.json({ error: "Failed to generate date recommendations" }, { status: 500 })
  }
}

