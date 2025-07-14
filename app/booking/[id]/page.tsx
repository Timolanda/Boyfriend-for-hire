"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Gift, 
  Star,
  Package,
  Repeat,
  Heart,
  Zap
} from "lucide-react"

interface BoyfriendProfile {
  id: string
  name: string
  age: number
  rating: number
  hourlyRate: number
  bio: string
  interests: string[]
  image: string
  verified: boolean
  availableSlots: string[]
}

interface PackageDeal {
  id: string
  name: string
  description: string
  duration: number
  price: number
  savings: number
  features: string[]
}

const timeSlots = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"]

const packageDeals: PackageDeal[] = [
  {
    id: "first-date",
    name: "First Date Package",
    description: "Perfect for getting to know each other",
    duration: 2,
    price: 120,
    savings: 20,
    features: ["2-hour date", "Coffee/dinner included", "Photo session", "Follow-up chat"]
  },
  {
    id: "weekend-getaway",
    name: "Weekend Getaway",
    description: "Extended time together for deeper connection",
    duration: 6,
    price: 300,
    savings: 60,
    features: ["6-hour date", "Activity planning", "Transportation", "Memory book"]
  },
  {
    id: "monthly-package",
    name: "Monthly Package",
    description: "Regular dates for ongoing relationship",
    duration: 12,
    price: 500,
    savings: 150,
    features: ["4 dates (3 hours each)", "Priority booking", "Personal concierge", "Exclusive events"]
  }
]

export default function BookingPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined)
  const [location, setLocation] = useState("")
  const [customNotes, setCustomNotes] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState("weekly")
  const [boyfriendProfile, setBoyfriendProfile] = useState<BoyfriendProfile | null>(null)
  const [loyaltyPoints, setLoyaltyPoints] = useState(75)
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch boyfriend profile
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/boyfriend/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setBoyfriendProfile(data)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchProfile()
  }, [params.id])

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
    const packageDeal = packageDeals.find(p => p.id === packageId)
    if (packageDeal) {
      setSelectedTime("6:00 PM") // Default time for packages
    }
  }

  const handleUseLoyaltyPoints = (checked: boolean) => {
    setUseLoyaltyPoints(checked)
    if (checked) {
      toast({
        title: "Loyalty Points Applied",
        description: "You'll save $10 on this booking!",
      })
    }
  }

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        boyfriendId: params.id,
        date: selectedDate,
        time: selectedTime,
        package: selectedPackage,
        location,
        notes: customNotes,
        isRecurring,
        recurringFrequency,
        useLoyaltyPoints,
        loyaltyPointsUsed: useLoyaltyPoints ? 50 : 0
      }

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      })

      if (response.ok) {
        toast({
          title: "Booking Confirmed!",
          description: "Your date has been scheduled successfully.",
        })
        // Navigate to booking confirmation page
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const calculateTotalPrice = () => {
    if (!boyfriendProfile) return 0
    
    let basePrice = boyfriendProfile.hourlyRate * 2 // Default 2 hours
    
    if (selectedPackage) {
      const packageDeal = packageDeals.find(p => p.id === selectedPackage)
      if (packageDeal) {
        basePrice = packageDeal.price
      }
    }

    if (useLoyaltyPoints) {
      basePrice -= 10 // $10 discount
    }

    return basePrice
  }

  if (!boyfriendProfile) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-gray-200'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Boyfriend Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Booking with {boyfriendProfile.name}</span>
            {boyfriendProfile.verified && (
              <Badge variant="default" className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Verified</span>
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {boyfriendProfile.name[0]}
            </div>
            <div>
              <h3 className="font-semibold">{boyfriendProfile.name}, {boyfriendProfile.age}</h3>
              <p className="text-sm text-muted-foreground">{boyfriendProfile.bio}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm">Rating: {boyfriendProfile.rating}/5</span>
                <span className="text-sm">${boyfriendProfile.hourlyRate}/hour</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentStep === 1 && (
        <>
          {/* Package Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Choose Your Package</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {packageDeals.map((packageDeal) => (
                  <Card 
                    key={packageDeal.id} 
                    className={`cursor-pointer transition-all ${
                      selectedPackage === packageDeal.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handlePackageSelect(packageDeal.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{packageDeal.name}</CardTitle>
                      <CardDescription>{packageDeal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">${packageDeal.price}</span>
                          <Badge variant="secondary">Save ${packageDeal.savings}</Badge>
                        </div>
                        <ul className="space-y-1">
                          {packageDeal.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm">
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setCurrentStep(2)} disabled={!selectedPackage}>
              Next: Schedule
            </Button>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          {/* Date & Time Selection */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Select Date</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={setSelectedDate} 
                  className="rounded-md border" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Select Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={setSelectedTime} value={selectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Location & Notes */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter meeting location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special requests or preferences?"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recurring Booking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Repeat className="w-5 h-5" />
                <span>Recurring Booking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recurring"
                    checked={isRecurring}
                    onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                  />
                  <Label htmlFor="recurring">Schedule recurring dates</Label>
                </div>
                {isRecurring && (
                  <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Previous
            </Button>
            <Button onClick={() => setCurrentStep(3)} disabled={!selectedDate || !selectedTime}>
              Next: Review
            </Button>
          </div>
        </>
      )}

      {currentStep === 3 && (
        <>
          {/* Loyalty Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <span>Loyalty Points</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Available Points: {loyaltyPoints}</span>
                  <Badge variant="outline">50 points = $10 discount</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useLoyalty"
                    checked={useLoyaltyPoints}
                    onCheckedChange={handleUseLoyaltyPoints}
                    disabled={loyaltyPoints < 50}
                  />
                  <Label htmlFor="useLoyalty">Use 50 points for $10 discount</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span>{packageDeals.find(p => p.id === selectedPackage)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>{location || "To be decided"}</span>
                </div>
                {isRecurring && (
                  <div className="flex justify-between">
                    <span>Recurring:</span>
                    <span>{recurringFrequency}</span>
                  </div>
                )}
                {useLoyaltyPoints && (
                  <div className="flex justify-between text-green-600">
                    <span>Loyalty Discount:</span>
                    <span>-$10</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Previous
            </Button>
            <Button 
              className="w-full md:w-auto" 
              onClick={handleConfirmBooking}
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Booking
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

