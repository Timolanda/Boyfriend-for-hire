"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterBoyfriend() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bio: "",
    interests: "",
    availability: "",
    hourlyRate: "",
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/register-boyfriend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Registration failed")

      toast({
        title: "Registration Successful",
        description: "Your profile has been created. We'll review it shortly.",
      })
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Register as a Boyfriend for Hire</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input id="interests" name="interests" value={formData.interests} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            <Input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit">Register</Button>
        </form>
      </CardContent>
    </Card>
  )
}

