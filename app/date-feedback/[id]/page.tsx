"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

export default function DateFeedback({ params }: { params: { id: string } }) {
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(5)
  const { toast } = useToast()

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/date-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateId: params.id,
          feedback,
          rating,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      const data = await response.json()
      toast({
        title: "Feedback Submitted",
        description: data.analysis,
      })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Date Feedback</h1>

      <Card>
        <CardHeader>
          <CardTitle>How was your date?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Rating: {rating}/10</label>
            <Slider min={1} max={10} step={1} value={[rating]} onValueChange={(value) => setRating(value[0])} />
          </div>
          <Textarea
            placeholder="Tell us about your date experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
          />
          <Button onClick={handleSubmit}>Submit Feedback</Button>
        </CardContent>
      </Card>
    </div>
  )
}

