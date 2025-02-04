import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { dateId, feedback, rating } = await req.json()

  const prompt = `
    Analyze the following date feedback:
    Date ID: ${dateId}
    Rating: ${rating}/10
    Feedback: ${feedback}

    Provide a brief analysis of the date experience, including:
    1. Overall sentiment
    2. Key positive aspects
    3. Areas for improvement
    4. Suggestions for future dates

    Return the analysis as a JSON object with the following structure:
    {
      "sentiment": "positive/neutral/negative",
      "positiveAspects": ["aspect1", "aspect2", ...],
      "areasForImprovement": ["area1", "area2", ...],
      "suggestions": ["suggestion1", "suggestion2", ...]
    }
  `

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    })

    const analysis = JSON.parse(completion.choices[0].message.content || "{}")

    // In a real app, you would save this analysis to a database

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error analyzing date feedback:", error)
    return NextResponse.json({ error: "Failed to analyze date feedback" }, { status: 500 })
  }
}

