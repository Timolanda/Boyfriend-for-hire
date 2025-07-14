"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function FindMatch() {
  const [age, setAge] = useState([25, 35])
  const [distance, setDistance] = useState(10)
  const [virtualOnly, setVirtualOnly] = useState(false)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFindMatches = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/matchmaking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPreferences: {
            ageRange: age,
            maxDistance: distance,
            virtualOnly,
          },
          userProfile: {
            // This would come from the user's actual profile
            age: 30,
            interests: ["hiking", "movies", "cooking"],
            personalityTraits: ["outgoing", "adventurous"],
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch matches")
      }

      const data = await response.json()
      setMatches(data.matches)
    } catch (error) {
      console.error("Error fetching matches:", error)
      toast({
        title: "Error",
        description: "Failed to fetch matches. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Find Your Perfect Match
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover compatible partners based on your preferences and personality
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-xl">Your Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Age Range: {age[0]} - {age[1]}
              </label>
              <Slider min={18} max={60} step={1} value={age} onValueChange={setAge} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Maximum Distance: {distance} km</label>
              <Slider min={1} max={100} step={1} value={[distance]} onValueChange={(value) => setDistance(value[0])} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="virtual-only" checked={virtualOnly} onCheckedChange={setVirtualOnly} />
              <label htmlFor="virtual-only" className="text-gray-700">Virtual Dates Only</label>
            </div>
            <Button 
              onClick={handleFindMatches} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
            >
              {loading ? "Finding Matches..." : "Find Matches"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Your Matches
          </h2>
          {matches.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No matches found yet. Try adjusting your preferences!</p>
            </div>
          )}
          {matches.map((match, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex items-center space-x-4">
                <Avatar className="w-16 h-16 ring-4 ring-purple-200">
                  <AvatarImage src={`/placeholder.svg?height=100&width=100&text=${match.name}`} alt={match.name} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                    {match.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {match.name}, {match.age}
                  </h3>
                  <p className="text-gray-600 mb-2">{match.bio}</p>
                  <p className="text-sm text-purple-600 font-medium mb-1">Interests: {match.interests.join(", ")}</p>
                  <p className="text-sm font-bold text-pink-600">Compatibility: {match.compatibilityScore}%</p>
                  <p className="text-sm italic text-gray-500 mt-1">{match.reasonForMatch}</p>
                </div>
                <Link href={`/profile/${index}`}>
                  <Button 
                    variant="outline" 
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
                  >
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

