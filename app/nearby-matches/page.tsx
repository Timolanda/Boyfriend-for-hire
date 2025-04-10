"use client"

import { useState, useEffect } from "react"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const containerStyle = {
  width: "100%",
  height: "400px",
}

const center = {
  lat: 40.7128,
  lng: -74.006,
}

interface Match {
  id: number
  name: string
  image: string
  distance: number
  location: {
    lat: number
    lng: number
  }
}

export default function NearbyMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [userLocation, setUserLocation] = useState(center)

  useEffect(() => {
    // In a real app, this would be an API call to get nearby matches
    const fetchNearbyMatches = () => {
      const mockMatches: Match[] = [
        {
          id: 1,
          name: "John",
          image: "/placeholder.svg?height=50&width=50",
          distance: 0.5,
          location: { lat: 40.7138, lng: -74.007 },
        },
        {
          id: 2,
          name: "Mike",
          image: "/placeholder.svg?height=50&width=50",
          distance: 1.2,
          location: { lat: 40.7118, lng: -74.005 },
        },
        {
          id: 3,
          name: "Alex",
          image: "/placeholder.svg?height=50&width=50",
          distance: 2.0,
          location: { lat: 40.7148, lng: -74.008 },
        },
      ]
      setMatches(mockMatches)
    }

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          console.error("Error: The Geolocation service failed.")
        },
      )
    } else {
      console.error("Error: Your browser doesn't support geolocation.")
    }

    fetchNearbyMatches()
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Nearby Matches</h1>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <GoogleMap mapContainerStyle={containerStyle} center={userLocation} zoom={14}>
          {matches.map((match) => (
            <Marker key={match.id} position={match.location} />
          ))}
        </GoogleMap>
      </LoadScript>

      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id}>
            <CardContent className="p-4 flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={match.image} alt={match.name} />
                <AvatarFallback>{match.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{match.name}</h3>
                <p className="text-sm text-muted-foreground">{match.distance} miles away</p>
              </div>
              <Link href={`/profile/${match.id}`}>
                <Button variant="outline">View Profile</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

