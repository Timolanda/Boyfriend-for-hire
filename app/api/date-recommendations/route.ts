import { NextResponse } from "next/server"
import OpenAI from "openai"

// Only initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(req: Request) {
  const { userProfile, preferences, location } = await req.json()

  // Check if OpenAI is available
  if (!openai) {
    return NextResponse.json({ 
      error: "OpenAI API not configured",
      recommendations: [
        {
          name: "Coffee & Conversation",
          description: "A cozy coffee shop for a relaxed first meeting",
          duration: "1-2 hours",
          cost: "$10-20",
          location: "Downtown area",
          whyRecommended: "Perfect for getting to know each other in a comfortable setting"
        },
        {
          name: "Art Gallery Walk",
          description: "Explore local art galleries and museums",
          duration: "2-3 hours",
          cost: "$15-30",
          location: "Arts district",
          whyRecommended: "Great for cultural exploration and meaningful conversations"
        }
      ]
    }, { status: 503 })
  }

  const prompt = `
    Based on the user profile and preferences, suggest 5 date ideas:
    User Profile: ${JSON.stringify(userProfile)}
    Preferences: ${JSON.stringify(preferences)}
    Location: ${location}

    For each recommendation include:
    - Name
    - Description
    - Duration
    - Estimated cost
    - Location
    - Why it's recommended

    Return as JSON array.
  `

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    })

    const recommendations = JSON.parse(completion.choices[0].message.content || "[]")

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error generating date recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}

