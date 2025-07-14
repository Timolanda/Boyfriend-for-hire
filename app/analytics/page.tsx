"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  DollarSign, 
  Calendar,
  Star,
  MapPin,
  BarChart3,
  Activity,
  Target,
  Award,
  Eye,
  Heart,
  MessageCircle
} from "lucide-react"

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    monthlyRevenue: number
    totalBookings: number
    averageRating: number
  }
  userMetrics: {
    newUsers: number
    returningUsers: number
    userRetention: number
    averageSessionDuration: number
  }
  revenueMetrics: {
    totalRevenue: number
    monthlyGrowth: number
    averageBookingValue: number
    topRevenueSources: Array<{ source: string; revenue: number }>
  }
  bookingMetrics: {
    totalBookings: number
    completedBookings: number
    cancelledBookings: number
    averageBookingDuration: number
    popularTimeSlots: Array<{ time: string; bookings: number }>
  }
  performanceMetrics: {
    conversionRate: number
    customerSatisfaction: number
    responseTime: number
    systemUptime: number
  }
}

const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalUsers: 15420,
    activeUsers: 8920,
    totalRevenue: 284750,
    monthlyRevenue: 45680,
    totalBookings: 3240,
    averageRating: 4.6
  },
  userMetrics: {
    newUsers: 1240,
    returningUsers: 7680,
    userRetention: 78.5,
    averageSessionDuration: 12.5
  },
  revenueMetrics: {
    totalRevenue: 284750,
    monthlyGrowth: 23.4,
    averageBookingValue: 87.50,
    topRevenueSources: [
      { source: "Premium Subscriptions", revenue: 125000 },
      { source: "VIP Services", revenue: 89000 },
      { source: "Standard Bookings", revenue: 70750 }
    ]
  },
  bookingMetrics: {
    totalBookings: 3240,
    completedBookings: 2980,
    cancelledBookings: 260,
    averageBookingDuration: 2.5,
    popularTimeSlots: [
      { time: "6:00 PM", bookings: 450 },
      { time: "7:00 PM", bookings: 380 },
      { time: "8:00 PM", bookings: 320 },
      { time: "5:00 PM", bookings: 280 },
      { time: "9:00 PM", bookings: 220 }
    ]
  },
  performanceMetrics: {
    conversionRate: 68.5,
    customerSatisfaction: 92.3,
    responseTime: 1.2,
    systemUptime: 99.8
  }
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData)
  const [timeRange, setTimeRange] = useState("30d")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
        if (response.ok) {
          const data = await response.json()
          setAnalyticsData(data)
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600">Track your platform performance and user insights</p>
      </div>
      <div className="flex items-center justify-center mb-8 gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 bg-white/80 border-gray-200 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600">
          <BarChart3 className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/90 shadow-xl border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{formatNumber(analyticsData.overview.totalUsers)}</div>
            <p className="text-xs text-green-600">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/90 shadow-xl border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{formatNumber(analyticsData.overview.activeUsers)}</div>
            <p className="text-xs text-green-600">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/90 shadow-xl border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{formatCurrency(analyticsData.overview.totalRevenue)}</div>
            <p className="text-xs text-green-600">
              +23.4% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/90 shadow-xl border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{analyticsData.overview.averageRating}/5</div>
            <p className="text-xs text-green-600">
              +0.2 from last month
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Detailed Metrics */}
      <div className="grid gap-6 md:grid-cols-2 mt-10">
        {/* User Metrics */}
        <Card className="bg-white/90 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <Users className="w-5 h-5 text-pink-500" />
              <span>User Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>New Users</span>
                <span className="font-semibold text-purple-700">{formatNumber(analyticsData.userMetrics.newUsers)}</span>
              </div>
              <Progress value={75} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Returning Users</span>
                <span className="font-semibold text-purple-700">{formatNumber(analyticsData.userMetrics.returningUsers)}</span>
              </div>
              <Progress value={85} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>User Retention</span>
                <span className="font-semibold text-purple-700">{analyticsData.userMetrics.userRetention}%</span>
              </div>
              <Progress value={analyticsData.userMetrics.userRetention} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Avg. Session Duration</span>
                <span className="font-semibold text-purple-700">{analyticsData.userMetrics.averageSessionDuration} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Revenue Metrics */}
        <Card className="bg-white/90 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <DollarSign className="w-5 h-5 text-pink-500" />
              <span>Revenue Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monthly Growth</span>
                <span className="font-semibold text-green-600">+{analyticsData.revenueMetrics.monthlyGrowth}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Avg. Booking Value</span>
                <span className="font-semibold text-purple-700">{formatCurrency(analyticsData.revenueMetrics.averageBookingValue)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Revenue Sources</h4>
              {analyticsData.revenueMetrics.topRevenueSources.map((source, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{source.source}</span>
                    <span className="text-purple-700">{formatCurrency(source.revenue)}</span>
                  </div>
                  <Progress 
                    value={(source.revenue / analyticsData.revenueMetrics.totalRevenue) * 100} 
                    className="w-full" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Booking Analytics */}
      <div className="grid gap-6 md:grid-cols-2 mt-10">
        <Card className="bg-white/90 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <Calendar className="w-5 h-5 text-pink-500" />
              <span>Booking Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData.bookingMetrics.completedBookings}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {analyticsData.bookingMetrics.cancelledBookings}
                </div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Avg. Booking Duration</span>
                <span className="font-semibold text-purple-700">{analyticsData.bookingMetrics.averageBookingDuration} hours</span>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Popular Time Slots</h4>
              {analyticsData.bookingMetrics.popularTimeSlots.map((slot, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{slot.time}</span>
                  <span className="text-purple-700">{slot.bookings} bookings</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <Target className="w-5 h-5 text-pink-500" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Conversion Rate</span>
                <span className="font-semibold text-purple-700">{analyticsData.performanceMetrics.conversionRate}%</span>
              </div>
              <Progress value={analyticsData.performanceMetrics.conversionRate} className="w-full" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Customer Satisfaction</span>
                <span className="font-semibold text-purple-700">{analyticsData.performanceMetrics.customerSatisfaction}%</span>
              </div>
              <Progress value={analyticsData.performanceMetrics.customerSatisfaction} className="w-full" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Response Time</span>
                <span className="font-semibold text-purple-700">{analyticsData.performanceMetrics.responseTime}s</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>System Uptime</span>
                <span className="font-semibold text-purple-700">{analyticsData.performanceMetrics.systemUptime}%</span>
              </div>
              <Progress value={analyticsData.performanceMetrics.systemUptime} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Geographic Analytics */}
      <Card className="bg-white/90 shadow-xl border-0 mt-10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-700">
            <MapPin className="w-5 h-5 text-pink-500" />
            <span>Geographic Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg bg-pink-50">
              <div className="text-2xl font-bold text-blue-600">New York</div>
              <p className="text-sm text-muted-foreground">2,450 users</p>
              <Badge variant="secondary" className="mt-2 bg-pink-100 text-pink-800">Top Market</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-green-600">Los Angeles</div>
              <p className="text-sm text-muted-foreground">1,890 users</p>
              <Badge variant="outline" className="mt-2 border-purple-300 text-purple-700">Growing</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-purple-600">Chicago</div>
              <p className="text-sm text-muted-foreground">1,230 users</p>
              <Badge variant="outline" className="mt-2 border-blue-300 text-blue-700">Stable</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Quick Actions */}
      <Card className="bg-white/90 shadow-xl border-0 mt-10">
        <CardHeader>
          <CardTitle className="text-purple-700">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="flex items-center space-x-2 border-pink-200 text-pink-600 hover:bg-pink-50">
              <Eye className="w-4 h-4" />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 border-purple-200 text-purple-600 hover:bg-purple-50">
              <Heart className="w-4 h-4" />
              <span>User Insights</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 border-blue-200 text-blue-600 hover:bg-blue-50">
              <MessageCircle className="w-4 h-4" />
              <span>Feedback</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 border-green-200 text-green-600 hover:bg-green-50">
              <Award className="w-4 h-4" />
              <span>Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 