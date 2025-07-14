import { NextResponse } from "next/server"
import OpenAI from "openai"

// Only initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(req: Request) {
  const { dateExperience, userFeedback } = await req.json()

  // Check if OpenAI is available
  if (!openai) {
    return NextResponse.json({ 
      error: "OpenAI API not configured",
      feedback: {
        analysis: "Based on your feedback, it sounds like you had a mixed experience. Consider discussing your expectations and preferences with your match for better future dates.",
        suggestions: [
          "Try a different type of date activity",
          "Communicate your preferences more clearly",
          "Consider a shorter first meeting"
        ],
        rating: 3
      }
    }, { status: 503 })
  }

  const prompt = `
    Analyze this date feedback and provide insights:
    Date Experience: ${JSON.stringify(dateExperience)}
    User Feedback: ${JSON.stringify(userFeedback)}

    Provide:
    1. Analysis of the experience (2-3 sentences)
    2. Suggestions for improvement (3-4 points)
    3. Overall rating (1-5)

    Return as JSON with analysis, suggestions array, and rating.
  `

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    })

    const feedback = JSON.parse(completion.choices[0].message.content || "{}")

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error analyzing date feedback:", error)
    return NextResponse.json({ error: "Failed to analyze feedback" }, { status: 500 })
  }
}

