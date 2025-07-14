"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { 
  PhoneIcon, 
  ShieldCheckIcon, 
  AlertTriangleIcon, 
  MapPinIcon, 
  ClockIcon,
  UserIcon,
  BellIcon,
  XIcon,
  FlagIcon,
  HeartIcon,
  MessageCircleIcon
} from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
}

interface DateTracker {
  id: string
  location: string
  dateTime: string
  boyfriendName: string
  status: "active" | "completed" | "cancelled"
}

export default function SafetyCenter() {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Sarah Johnson", phone: "+1 (555) 123-4567", relationship: "Sister" },
    { id: "2", name: "Mike Wilson", phone: "+1 (555) 987-6543", relationship: "Friend" }
  ])
  
  const [activeDates, setActiveDates] = useState<DateTracker[]>([
    { 
      id: "1", 
      location: "Central Park, NYC", 
      dateTime: "2024-01-15T18:00", 
      boyfriendName: "John Smith",
      status: "active"
    }
  ])
  
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" })
  const [showAddContact, setShowAddContact] = useState(false)
  const { toast } = useToast()

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      })
      return
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    }

    setEmergencyContacts([...emergencyContacts, contact])
    setNewContact({ name: "", phone: "", relationship: "" })
    setShowAddContact(false)
    
    toast({
      title: "Contact Added",
      description: "Emergency contact has been added successfully."
    })
  }

  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id))
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed."
    })
  }

  const handleSOS = async () => {
    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      }

      // Send SOS alert to emergency contacts
      const response = await fetch("/api/safety/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          contacts: emergencyContacts,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        toast({
          title: "SOS Alert Sent",
          description: "Emergency contacts have been notified with your location.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("SOS error:", error)
      toast({
        title: "SOS Failed",
        description: "Unable to send SOS alert. Please call emergency services directly.",
        variant: "destructive"
      })
    }
  }

  const handleDateCheckIn = async (dateId: string) => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const checkIn = {
        dateId,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        timestamp: new Date().toISOString()
      }

      const response = await fetch("/api/safety/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkIn)
      })

      if (response.ok) {
        toast({
          title: "Check-in Successful",
          description: "Your location has been shared with your emergency contacts."
        })
      }
    } catch (error) {
      console.error("Check-in error:", error)
      toast({
        title: "Check-in Failed",
        description: "Unable to share location. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleBlockUser = async (userId: string) => {
    try {
      const response = await fetch("/api/safety/block-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        toast({
          title: "User Blocked",
          description: "User has been blocked and can no longer contact you."
        })
      }
    } catch (error) {
      console.error("Block user error:", error)
      toast({
        title: "Block Failed",
        description: "Unable to block user. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleReportUser = async (userId: string, reason: string) => {
    try {
      const response = await fetch("/api/safety/report-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason })
      })

      if (response.ok) {
        toast({
          title: "User Reported",
          description: "Your report has been submitted and will be reviewed."
        })
      }
    } catch (error) {
      console.error("Report user error:", error)
      toast({
        title: "Report Failed",
        description: "Unable to submit report. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Safety Center
          </h1>
          <Badge className="flex items-center space-x-1 bg-green-100 text-green-700 border-green-200">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Safety Active</span>
          </Badge>
        </div>

        {/* Emergency SOS Button */}
        <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangleIcon className="w-6 h-6" />
              <span>Emergency SOS</span>
            </CardTitle>
            <CardDescription className="text-red-600">
              Press this button to immediately alert your emergency contacts with your location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full py-8 text-xl font-bold bg-red-600 hover:bg-red-700"
              onClick={handleSOS}
            >
              <PhoneIcon className="mr-2 h-6 w-6" /> 
              SOS - EMERGENCY
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5" />
                <span>Emergency Contacts</span>
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddContact(!showAddContact)}
              >
                {showAddContact ? "Cancel" : "Add Contact"}
              </Button>
            </CardTitle>
            <CardDescription>
              Trusted contacts who will be notified in case of an emergency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddContact && (
              <div className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="contact-name">Name</Label>
                    <Input 
                      id="contact-name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input 
                      id="contact-phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-relationship">Relationship</Label>
                    <Input 
                      id="contact-relationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                      placeholder="e.g., Sister, Friend"
                    />
                  </div>
                </div>
                <Button onClick={handleAddContact}>Add Contact</Button>
              </div>
            )}

            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    <Badge variant="secondary">{contact.relationship}</Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Date Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5" />
              <span>Active Date Tracker</span>
            </CardTitle>
            <CardDescription>
              Monitor your current dates and share location with trusted contacts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDates.map((date) => (
              <div key={date.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Date with {date.boyfriendName}</p>
                    <p className="text-sm text-muted-foreground">{date.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(date.dateTime).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={date.status === "active" ? "default" : "secondary"}>
                    {date.status}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDateCheckIn(date.id)}
                    className="flex items-center space-x-1"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    <span>Check In</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBlockUser("user-id")}
                    className="flex items-center space-x-1"
                  >
                    <XIcon className="w-4 h-4" />
                    <span>Block</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReportUser("user-id", "Inappropriate behavior")}
                    className="flex items-center space-x-1"
                  >
                    <FlagIcon className="w-4 h-4" />
                    <span>Report</span>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>Safety Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="text-green-500 mt-1" />
              <div>
                <p className="font-medium">Meet in Public Places</p>
                <p className="text-sm text-muted-foreground">Always meet in public places for your first few dates</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="text-green-500 mt-1" />
              <div>
                <p className="font-medium">Trust Your Instincts</p>
                <p className="text-sm text-muted-foreground">If something feels off, it probably is. Don't ignore red flags</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="text-green-500 mt-1" />
              <div>
                <p className="font-medium">Share Your Plans</p>
                <p className="text-sm text-muted-foreground">Let a friend or family member know about your date plans</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangleIcon className="text-yellow-500 mt-1" />
              <div>
                <p className="font-medium">Protect Personal Information</p>
                <p className="text-sm text-muted-foreground">Never share personal financial information with your date</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangleIcon className="text-yellow-500 mt-1" />
              <div>
                <p className="font-medium">Stay Sober</p>
                <p className="text-sm text-muted-foreground">Limit alcohol consumption and stay aware of your surroundings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <MessageCircleIcon className="w-4 h-4" />
                <span>Contact Support</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <FlagIcon className="w-4 h-4" />
                <span>Report Issue</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <HeartIcon className="w-4 h-4" />
                <span>Safety Resources</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <BellIcon className="w-4 h-4" />
                <span>Notifications</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

