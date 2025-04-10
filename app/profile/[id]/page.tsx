"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StarIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [dateRecommendations, setDateRecommendations] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, you would fetch the profile data from your API
    setProfile({
      id: params.id,
      name: "John Doe",
      age: 28,
      bio: "Charming and attentive companion for any occasion. I love outdoor activities, fine dining, and meaningful conversations.",
      images: [
        "/placeholder.svg?height=400&width=300",
        "/placeholder.svg?height=400&width=300",
        "/placeholder.svg?height=400&width=300",
      ],
      interests: ["Hiking", "Photography", "Cooking"],
      rating: 4.8,
      reviews: [
        { id: 1, user: "Alice", rating: 5, comment: "John was a perfect gentleman and made our date so enjoyable!" },
        { id: 2, user: "Emma", rating: 4, comment: "Great conversation and very attentive. Would book again." },
      ],
    })
  }, [params.id])

  useEffect(() => {
    const fetchDateRecommendations = async () => {
      try {
        const response = await fetch("/api/date-recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userProfile: {
              // This would come from the actual user's profile
              age: 30,
              interests: ["hiking", "movies", "cooking"],
              personalityTraits: ["outgoing", "adventurous"],
            },
            matchProfile: profile,
            userPreferences: {
              // This would come from the user's saved preferences
              maxBudget: 100,
              preferredActivities: ["outdoor", "dining"],
            },
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch date recommendations")
        }

        const data = await response.json()
        setDateRecommendations(data.recommendations)
      } catch (error) {
        console.error("Error fetching date recommendations:", error)
        toast({
          title: "Error",
          description: "Failed to fetch date recommendations. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (profile) {
      fetchDateRecommendations()
    }
  }, [profile, toast])

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="relative h-96 overflow-hidden rounded-lg">
        <Image src={profile.images[0] || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {profile.name}, {profile.age}
          </h1>
          <Badge variant="secondary">
            ⭐ {profile.rating} ({profile.reviews.length} reviews)
          </Badge>
        </div>

        <p className="text-lg">{profile.bio}</p>

        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <Badge key={interest} variant="outline">
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              available: [new Date(2023, 5, 15), new Date(2023, 5, 16), new Date(2023, 5, 18), new Date(2023, 5, 20)],
            }}
            modifiersStyles={{
              available: { backgroundColor: "hsl(var(--accent))" },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dateRecommendations.map((recommendation, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{recommendation.dateIdea}</h3>
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                <p className="text-sm italic">{recommendation.whyGoodFit}</p>
                <p className="text-sm font-semibold">Estimated Cost: {recommendation.estimatedCost}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.reviews.map((review) => (
            <div key={review.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarFallback>{review.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center">
                  <h3 className="font-semibold">{review.user}</h3>
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button className="w-full text-lg py-6" variant="primary">
        Book a Date
      </Button>
    </div>
  )
}

