"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    locationSharing: true,
    activityStatus: true,
    dataCollection: true,
  })
  const { toast } = useToast()

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const saveSettings = async () => {
    try {
      const response = await fetch("/api/update-privacy-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error("Failed to update privacy settings")

      toast({
        title: "Settings Updated",
        description: "Your privacy settings have been saved.",
      })
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Privacy Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Manage Your Privacy</CardTitle>
          <CardDescription>Control who can see your information and how it's used.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="profile-visibility" className="flex flex-col space-y-1">
              <span>Profile Visibility</span>
              <span className="font-normal text-sm text-gray-500">Allow others to view your profile</span>
            </Label>
            <Switch
              id="profile-visibility"
              checked={settings.profileVisibility}
              onCheckedChange={() => handleToggle("profileVisibility")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="location-sharing" className="flex flex-col space-y-1">
              <span>Location Sharing</span>
              <span className="font-normal text-sm text-gray-500">Share your location with matches</span>
            </Label>
            <Switch
              id="location-sharing"
              checked={settings.locationSharing}
              onCheckedChange={() => handleToggle("locationSharing")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="activity-status" className="flex flex-col space-y-1">
              <span>Activity Status</span>
              <span className="font-normal text-sm text-gray-500">Show when you're active on the app</span>
            </Label>
            <Switch
              id="activity-status"
              checked={settings.activityStatus}
              onCheckedChange={() => handleToggle("activityStatus")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="data-collection" className="flex flex-col space-y-1">
              <span>Data Collection</span>
              <span className="font-normal text-sm text-gray-500">
                Allow us to collect usage data to improve our services
              </span>
            </Label>
            <Switch
              id="data-collection"
              checked={settings.dataCollection}
              onCheckedChange={() => handleToggle("dataCollection")}
            />
          </div>
          <Button onClick={saveSettings}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}

