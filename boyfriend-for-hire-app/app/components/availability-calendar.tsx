"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AvailabilityCalendar({ userId }: { userId: string }) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [availableDates, setAvailableDates] = useState<Date[]>([])

  useEffect(() => {
    // Fetch available dates from the server
    const fetchAvailableDates = async () => {
      try {
        const response = await fetch(`/api/availability/${userId}`)
        if (!response.ok) throw new Error("Failed to fetch availability")
        const data = await response.json()
        setAvailableDates(data.availableDates.map((d: string) => new Date(d)))
      } catch (error) {
        console.error("Error fetching availability:", error)
      }
    }

    fetchAvailableDates()
  }, [userId])

  const updateAvailability = async () => {
    try {
      const response = await fetch(`/api/availability/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableDates: selectedDates }),
      })
      if (!response.ok) throw new Error("Failed to update availability")
      // Refresh available dates after update
      setAvailableDates(selectedDates)
    } catch (error) {
      console.error("Error updating availability:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={setSelectedDates}
          className="rounded-md border"
          modifiers={{
            available: availableDates,
          }}
          modifiersStyles={{
            available: { backgroundColor: "hsl(var(--accent))" },
          }}
        />
        <Button onClick={updateAvailability} className="mt-4">
          Update Availability
        </Button>
      </CardContent>
    </Card>
  )
}

