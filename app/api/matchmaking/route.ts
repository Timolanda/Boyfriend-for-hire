import { NextResponse } from "next/server"
import OpenAI from "openai"

// Only initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(req: Request) {
  const { userPreferences, userProfile } = await req.json()

  // Check if OpenAI is available
  if (!openai) {
    return NextResponse.json({ 
      error: "OpenAI API not configured",
      matches: [
        {
          name: "Alex",
          age: 28,
          bio: "Adventure seeker who loves hiking and photography. Always up for trying new restaurants and exploring hidden gems in the city.",
          interests: ["Hiking", "Photography", "Food", "Travel", "Music"],
          compatibilityScore: 85,
          reasonForMatch: "Shared love for outdoor activities and culinary adventures"
        },
        {
          name: "Jordan",
          age: 26,
          bio: "Creative soul with a passion for art and music. Enjoys quiet evenings with good books and meaningful conversations.",
          interests: ["Art", "Music", "Reading", "Coffee", "Philosophy"],
          compatibilityScore: 78,
          reasonForMatch: "Complementary interests in creative pursuits and intellectual discussions"
        }
      ]
    }, { status: 503 })
  }

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

