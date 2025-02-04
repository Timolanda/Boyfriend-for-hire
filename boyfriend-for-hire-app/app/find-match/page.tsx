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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Find Your Perfect Match</h1>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Age Range: {age[0]} - {age[1]}
            </label>
            <Slider min={18} max={60} step={1} value={age} onValueChange={setAge} />
          </div>
          <div>
            <label className="text-sm font-medium">Maximum Distance: {distance} km</label>
            <Slider min={1} max={100} step={1} value={[distance]} onValueChange={(value) => setDistance(value[0])} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="virtual-only" checked={virtualOnly} onCheckedChange={setVirtualOnly} />
            <label htmlFor="virtual-only">Virtual Dates Only</label>
          </div>
          <Button onClick={handleFindMatches} disabled={loading}>
            {loading ? "Finding Matches..." : "Find Matches"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Matches</h2>
        {matches.map((match, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={`/placeholder.svg?height=100&width=100&text=${match.name}`} alt={match.name} />
                <AvatarFallback>{match.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">
                  {match.name}, {match.age}
                </h3>
                <p className="text-sm text-muted-foreground">{match.bio}</p>
                <p className="text-sm">Interests: {match.interests.join(", ")}</p>
                <p className="text-sm font-semibold">Compatibility: {match.compatibilityScore}%</p>
                <p className="text-sm italic">{match.reasonForMatch}</p>
              </div>
              <Link href={`/profile/${index}`}>
                <Button variant="outline">View Profile</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

