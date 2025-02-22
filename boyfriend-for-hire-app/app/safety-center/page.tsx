import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneIcon, ShieldCheckIcon, AlertTriangleIcon } from "lucide-react"

export default function SafetyCenter() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Safety Center</h1>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>Add trusted contacts who will be notified in case of an emergency.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emergency-contact">Emergency Contact</Label>
            <Input id="emergency-contact" placeholder="Enter name" />
          </div>
          <div>
            <Label htmlFor="emergency-number">Phone Number</Label>
            <Input id="emergency-number" placeholder="Enter phone number" />
          </div>
          <Button>Add Contact</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SOS Button</CardTitle>
          <CardDescription>Quickly share your location with emergency contacts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full py-8 text-xl">
            <PhoneIcon className="mr-2 h-6 w-6" /> SOS
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date Tracker</CardTitle>
          <CardDescription>Share your date details with a trusted contact.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="date-location">Date Location</Label>
            <Input id="date-location" placeholder="Enter location" />
          </div>
          <div>
            <Label htmlFor="date-time">Date Time</Label>
            <Input id="date-time" type="datetime-local" />
          </div>
          <div>
            <Label htmlFor="trusted-contact">Trusted Contact</Label>
            <Input id="trusted-contact" placeholder="Select contact" />
          </div>
          <Button>Share Date Details</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="text-green-500" />
            <p>Always meet in public places for your first few dates.</p>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="text-green-500" />
            <p>Trust your instincts. If something feels off, it probably is.</p>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="text-green-500" />
            <p>Let a friend or family member know about your date plans.</p>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangleIcon className="text-yellow-500" />
            <p>Never share personal financial information with your date.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

