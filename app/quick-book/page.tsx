"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Clock, MapPin, User } from "lucide-react"

export default function QuickBookPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedBoyfriend, setSelectedBoyfriend] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const availableBoyfriends = [
    { id: "1", name: "Alex", age: 28, rating: 4.8, specialties: ["Adventure", "Food", "Music"] },
    { id: "2", name: "Jordan", age: 26, rating: 4.9, specialties: ["Art", "Culture", "Coffee"] },
    { id: "3", name: "Sam", age: 30, rating: 4.7, specialties: ["Sports", "Outdoors", "Travel"] },
    { id: "4", name: "Chris", age: 27, rating: 4.9, specialties: ["Dancing", "Nightlife", "Fashion"] }
  ]

  const timeSlots = [
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
  ]

  const handleQuickBook = async () => {
    if (!selectedDate || !selectedTime || !selectedBoyfriend || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boyfriendId: selectedBoyfriend,
          date: selectedDate.toISOString(),
          time: selectedTime,
          location,
          duration: 2,
          notes: "Quick booking"
        })
      })

      if (response.ok) {
        toast({
          title: "Booking Confirmed!",
          description: "Your date has been scheduled successfully.",
        })
        // Reset form
        setSelectedDate(undefined)
        setSelectedTime("")
        setSelectedBoyfriend("")
        setLocation("")
      } else {
        throw new Error("Failed to create booking")
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Quick Book</h1>
        <p className="text-muted-foreground">Book a date in just a few clicks</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Boyfriend Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Choose Your Boyfriend</span>
            </CardTitle>
            <CardDescription>Select from our verified boyfriends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {availableBoyfriends.map((boyfriend) => (
                <div
                  key={boyfriend.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedBoyfriend === boyfriend.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedBoyfriend(boyfriend.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{boyfriend.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Age {boyfriend.age} • ⭐ {boyfriend.rating}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {boyfriend.specialties.join(", ")}
                      </p>
                    </div>
                    {selectedBoyfriend === boyfriend.id && (
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date & Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Date & Time</span>
            </CardTitle>
            <CardDescription>Pick your preferred date and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </CardTitle>
          <CardDescription>Where would you like to meet?</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter location (restaurant, cafe, etc.)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Quick Book Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleQuickBook}
          disabled={loading || !selectedDate || !selectedTime || !selectedBoyfriend || !location}
          className="px-8 py-3 text-lg"
        >
          {loading ? "Booking..." : "Quick Book Now"}
        </Button>
      </div>

      {/* Booking Summary */}
      {(selectedDate || selectedTime || selectedBoyfriend || location) && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedBoyfriend && (
                <p><strong>Boyfriend:</strong> {availableBoyfriends.find(b => b.id === selectedBoyfriend)?.name}</p>
              )}
              {selectedDate && (
                <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
              )}
              {selectedTime && (
                <p><strong>Time:</strong> {selectedTime}</p>
              )}
              {location && (
                <p><strong>Location:</strong> {location}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 