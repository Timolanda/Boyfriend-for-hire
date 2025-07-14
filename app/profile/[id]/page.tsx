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

interface Profile {
  id: string
  name: string
  age: number
  bio: string
  images: string[]
  interests: string[]
  rating: number
  reviews: Array<{
    id: number
    user: string
    rating: number
    comment: string
  }>
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null)
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="relative h-96 overflow-hidden rounded-lg shadow-2xl">
          <Image src={profile.images[0] || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {profile.name}, {profile.age}
            </h1>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
              ⭐ {profile.rating} ({profile.reviews.length} reviews)
            </Badge>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">{profile.bio}</p>

          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <Badge key={interest} className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-xl">Availability</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-purple-200"
              modifiers={{
                available: [new Date(2023, 5, 15), new Date(2023, 5, 16), new Date(2023, 5, 18), new Date(2023, 5, 20)],
              }}
              modifiersStyles={{
                available: { backgroundColor: "rgb(147, 51, 234)", color: "white" },
              }}
            />
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-xl">Date Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {dateRecommendations.map((recommendation, index) => (
              <Card key={index} className="bg-white/90 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg">{recommendation.dateIdea}</h3>
                  <p className="text-gray-600 mt-2">{recommendation.description}</p>
                  <p className="text-purple-600 italic mt-2">{recommendation.whyGoodFit}</p>
                  <p className="text-pink-600 font-semibold mt-2">Estimated Cost: {recommendation.estimatedCost}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-xl">Reviews</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {profile.reviews.map((review) => (
              <div key={review.id} className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg">
                <Avatar className="ring-2 ring-purple-200">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                    {review.user[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-800">{review.user}</h3>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{review.comment}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button 
          className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all" 
          variant="default"
        >
          Book a Date
        </Button>
      </div>
    </div>
  )
}

