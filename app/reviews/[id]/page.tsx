"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ReviewPage({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const { toast } = useToast()

  const handleSubmitReview = async () => {
    try {
      const response = await fetch("/api/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: params.id, rating, review }),
      })

      if (!response.ok) throw new Error("Failed to submit review")

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      })

      // Reset form
      setRating(0)
      setReview("")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Write a Review</h1>

      <Card>
        <CardHeader>
          <CardTitle>Rate your experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-8 h-8 cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
          />
          <Button onClick={handleSubmitReview} disabled={rating === 0 || !review.trim()}>
            Submit Review
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

