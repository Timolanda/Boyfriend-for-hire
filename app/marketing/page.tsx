"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { 
  Mail, 
  MessageSquare, 
  Share2, 
  Users, 
  Target, 
  BarChart3,
  Send,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Bell,
  TrendingUp,
  Zap,
  Settings,
  Play,
  Pause,
  Trash2
} from "lucide-react"

interface Campaign {
  id: string
  name: string
  type: "email" | "sms" | "push"
  status: "draft" | "scheduled" | "active" | "completed" | "paused"
  recipients: number
  sent: number
  opened: number
  clicked: number
  conversionRate: number
  scheduledDate?: string
  createdAt: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  category: string
  usage: number
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Welcome Series",
    type: "email",
    status: "active",
    recipients: 2500,
    sent: 2450,
    opened: 1890,
    clicked: 567,
    conversionRate: 23.1,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "New Boyfriend Alert",
    type: "sms",
    status: "scheduled",
    recipients: 1800,
    sent: 0,
    opened: 0,
    clicked: 0,
    conversionRate: 0,
    scheduledDate: "2024-01-20T10:00:00Z",
    createdAt: "2024-01-18"
  },
  {
    id: "3",
    name: "VIP Event Invitation",
    type: "email",
    status: "completed",
    recipients: 500,
    sent: 500,
    opened: 420,
    clicked: 156,
    conversionRate: 31.2,
    createdAt: "2024-01-10"
  }
]

const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to Boyfriend for Hire!",
    category: "Onboarding",
    usage: 45
  },
  {
    id: "new-match",
    name: "New Match Alert",
    subject: "You have a new match!",
    category: "Engagement",
    usage: 23
  },
  {
    id: "promotion",
    name: "Special Promotion",
    subject: "Limited Time Offer - 20% Off",
    category: "Promotional",
    usage: 12
  },
  {
    id: "event",
    name: "Event Invitation",
    subject: "Exclusive VIP Event",
    category: "Events",
    usage: 8
  }
]

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "email",
    subject: "",
    content: "",
    recipients: "all",
    scheduledDate: ""
  })
  const { toast } = useToast()

  const handleCreateCampaign = async () => {
    try {
      const response = await fetch("/api/marketing/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign)
      })

      if (response.ok) {
        toast({
          title: "Campaign Created",
          description: "Your campaign has been created successfully.",
        })
        setShowCreateCampaign(false)
        setNewCampaign({ name: "", type: "email", subject: "", content: "", recipients: "all", scheduledDate: "" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendTest = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/marketing/campaigns/${campaignId}/test`, {
        method: "POST"
      })

      if (response.ok) {
        toast({
          title: "Test Sent",
          description: "Test email has been sent to your inbox.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/marketing/campaigns/${campaignId}/pause`, {
        method: "POST"
      })

      if (response.ok) {
        setCampaigns(campaigns.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: "paused" as const }
            : campaign
        ))
        toast({
          title: "Campaign Paused",
          description: "Campaign has been paused successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pause campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "scheduled": return "bg-blue-500"
      case "completed": return "bg-gray-500"
      case "paused": return "bg-yellow-500"
      case "draft": return "bg-gray-400"
      default: return "bg-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="w-4 h-4" />
      case "sms": return <MessageSquare className="w-4 h-4" />
      case "push": return <Bell className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
          <p className="text-muted-foreground">Manage your email campaigns, SMS notifications, and marketing automation</p>
        </div>
        <Button onClick={() => setShowCreateCampaign(true)}>
          <Send className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.recipients, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(campaigns.reduce((sum, c) => sum + (c.opened / c.sent * 100), 0) / campaigns.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1.8%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Manage your email and SMS campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(campaign.type)}
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {campaign.recipients.toLocaleString()} recipients
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {campaign.opened.toLocaleString()} opens
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.conversionRate}% conversion
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendTest(campaign.id)}
                    >
                      Test
                    </Button>
                    {campaign.status === "active" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePauseCampaign(campaign.id)}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>Pre-built templates for common campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {emailTemplates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.subject}</p>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Used {template.usage} times
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Automation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Marketing Automation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-medium">Welcome Series</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically send welcome emails to new users
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View Stats</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h4 className="font-medium">Abandoned Cart</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Remind users about incomplete bookings
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View Stats</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h4 className="font-medium">Birthday Wishes</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Send personalized birthday messages
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">View Stats</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <Label htmlFor="campaign-type">Campaign Type</Label>
                  <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign({...newCampaign, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="sms">SMS Campaign</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                  placeholder="Enter subject line"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                  placeholder="Enter campaign content"
                  rows={6}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select value={newCampaign.recipients} onValueChange={(value) => setNewCampaign({...newCampaign, recipients: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="premium">Premium Users</SelectItem>
                      <SelectItem value="vip">VIP Users</SelectItem>
                      <SelectItem value="inactive">Inactive Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduled-date">Schedule Date (Optional)</Label>
                  <Input
                    id="scheduled-date"
                    type="datetime-local"
                    value={newCampaign.scheduledDate}
                    onChange={(e) => setNewCampaign({...newCampaign, scheduledDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign}>
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 