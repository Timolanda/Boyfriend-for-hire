"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Camera, FileText, Video, CheckCircle } from "lucide-react"

export default function RegisterBoyfriend() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bio: "",
    interests: "",
    availability: "",
    hourlyRate: "",
    phoneNumber: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  })
  
  const [verificationData, setVerificationData] = useState({
    photoIdUploaded: false,
    backgroundCheckConsent: false,
    videoVerificationCompleted: false,
    trustScore: 0,
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate file upload
      setVerificationData(prev => ({ ...prev, photoIdUploaded: true }))
      toast({
        title: "Photo ID Uploaded",
        description: "Your ID has been uploaded for verification.",
      })
    }
  }

  const handleBackgroundCheckConsent = (checked: boolean) => {
    setVerificationData(prev => ({ 
      ...prev, 
      backgroundCheckConsent: checked,
      trustScore: checked ? prev.trustScore + 20 : prev.trustScore - 20
    }))
  }

  const handleVideoVerification = async () => {
    // Simulate video verification
    setVerificationData(prev => ({ 
      ...prev, 
      videoVerificationCompleted: true,
      trustScore: prev.trustScore + 30
    }))
    toast({
      title: "Video Verification",
      description: "Please complete a brief video call for verification.",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/register-boyfriend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, verificationData }),
      })

      if (!response.ok) throw new Error("Registration failed")

      toast({
        title: "Registration Successful",
        description: "Your profile has been created and is under verification review.",
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6" />
            <span>Register as a Boyfriend for Hire - Step {currentStep} of 3</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input id="emergencyContact" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input id="emergencyPhone" name="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={handleInputChange} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="interests">Interests (comma-separated) *</Label>
                  <Input id="interests" name="interests" value={formData.interests} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="availability">Availability *</Label>
                  <Input id="availability" name="availability" value={formData.availability} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                  <Input id="hourlyRate" name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={nextStep}>Next: Identity Verification</Button>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Identity verification is required for all boyfriends to ensure safety and trust.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="w-5 h-5" />
                      <span>Photo ID Verification</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="photoId">Upload Government-Issued Photo ID</Label>
                      <Input
                        id="photoId"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground">
                        Acceptable: Driver's license, passport, or state ID
                      </p>
                      {verificationData.photoIdUploaded && (
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Uploaded</span>
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Background Check Consent</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="backgroundCheck"
                          checked={verificationData.backgroundCheckConsent}
                          onCheckedChange={handleBackgroundCheckConsent}
                        />
                        <Label htmlFor="backgroundCheck">
                          I consent to a background check for safety verification
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This helps ensure the safety of our community
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Video className="w-5 h-5" />
                      <span>Video Verification</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>Complete a brief video call to verify your identity</p>
                      <Button onClick={handleVideoVerification} variant="outline">
                        Start Video Verification
                      </Button>
                      {verificationData.videoVerificationCompleted && (
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>Previous</Button>
                  <Button onClick={nextStep}>Next: Trust Score</Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trust Score & Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Photo ID Verification</span>
                      <Badge variant={verificationData.photoIdUploaded ? "default" : "secondary"}>
                        {verificationData.photoIdUploaded ? "✓ Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Background Check Consent</span>
                      <Badge variant={verificationData.backgroundCheckConsent ? "default" : "secondary"}>
                        {verificationData.backgroundCheckConsent ? "✓ Consented" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Video Verification</span>
                      <Badge variant={verificationData.videoVerificationCompleted ? "default" : "secondary"}>
                        {verificationData.videoVerificationCompleted ? "✓ Completed" : "Pending"}
                      </Badge>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Trust Score</span>
                        <Badge variant="outline" className="text-lg">
                          {verificationData.trustScore}/100
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${verificationData.trustScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>Previous</Button>
                <Button onClick={handleSubmit} disabled={verificationData.trustScore < 50}>
                  Complete Registration
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

