"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { 
  Crown, 
  Star, 
  Gift, 
  Users, 
  Calendar, 
  MessageCircle, 
  Video, 
  Shield,
  Zap,
  Heart,
  Trophy,
  Sparkles
} from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  popular?: boolean
  icon: React.ReactNode
  color: string
  benefits: string[]
}

interface LoyaltyPoints {
  current: number
  total: number
  level: string
  nextLevel: string
  progress: number
  rewards: Reward[]
}

interface Reward {
  id: string
  name: string
  points: number
  description: string
  claimed: boolean
  available: boolean
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    icon: <Star className="w-6 h-6" />,
    color: "bg-blue-500",
    features: [
      "5 matches per month",
      "Basic chat",
      "Profile browsing",
      "Standard safety features"
    ],
    benefits: [
      "Access to verified boyfriends",
      "Basic customer support",
      "Standard booking system"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    icon: <Crown className="w-6 h-6" />,
    color: "bg-purple-500",
    features: [
      "Unlimited matches",
      "Video dates",
      "Priority support",
      "Advanced safety features",
      "Voice messages"
    ],
    benefits: [
      "All Basic features",
      "Priority booking",
      "Enhanced matching algorithm",
      "24/7 customer support",
      "Date planning assistance"
    ],
    popular: true
  },
  {
    id: "vip",
    name: "VIP",
    price: 39.99,
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    features: [
      "All Premium features",
      "Personal matchmaker",
      "Exclusive events",
      "Custom date planning",
      "Priority booking",
      "Luxury concierge service"
    ],
    benefits: [
      "All Premium features",
      "Dedicated relationship consultant",
      "Exclusive VIP events",
      "Custom date experiences",
      "Luxury transportation",
      "Personal safety coordinator"
    ]
  },
]

const loyaltyRewards: Reward[] = [
  {
    id: "free-date",
    name: "Free Date",
    points: 100,
    description: "One free date with any boyfriend",
    claimed: false,
    available: true
  },
  {
    id: "premium-upgrade",
    name: "Premium Upgrade",
    points: 250,
    description: "1 month free Premium subscription",
    claimed: false,
    available: true
  },
  {
    id: "vip-event",
    name: "VIP Event Access",
    points: 500,
    description: "Exclusive VIP event invitation",
    claimed: false,
    available: true
  },
  {
    id: "personal-matchmaker",
    name: "Personal Matchmaker",
    points: 1000,
    description: "1 hour session with personal matchmaker",
    claimed: false,
    available: false
  }
]

export default function Subscription() {
  const [loading, setLoading] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState("basic")
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints>({
    current: 75,
    total: 100,
    level: "Bronze",
    nextLevel: "Silver",
    progress: 75,
    rewards: loyaltyRewards
  })
  const [showLoyalty, setShowLoyalty] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch current user's subscription and loyalty data
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/subscription")
        if (response.ok) {
          const data = await response.json()
          setCurrentPlan(data.currentPlan)
          setLoyaltyPoints(data.loyaltyPoints)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      if (!response.ok) throw new Error("Failed to create checkout session")

      const { sessionId } = await response.json()
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleClaimReward = async (rewardId: string) => {
    try {
      const response = await fetch("/api/loyalty/claim-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId })
      })

      if (response.ok) {
        toast({
          title: "Reward Claimed!",
          description: "Your reward has been added to your account.",
        })
        // Update loyalty points
        const reward = loyaltyRewards.find(r => r.id === rewardId)
        setLoyaltyPoints(prev => ({
          ...prev,
          current: prev.current - (reward?.points || 0)
        }))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBookMatchmaker = async () => {
    try {
      const response = await fetch("/api/vip/book-matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationType: "initial" })
      })

      if (response.ok) {
        toast({
          title: "Matchmaker Booked!",
          description: "We'll contact you within 24 hours to schedule your consultation.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book matchmaker. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Choose Your Experience
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            From basic matching to luxury VIP services, we have the perfect plan for your dating journey.
          </p>
        </div>

        {/* Current Plan Status */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Current Plan: {plans.find(p => p.id === currentPlan)?.name}</h3>
                <p className="text-gray-600">You're currently on the {currentPlan} plan</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowLoyalty(!showLoyalty)}
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <Gift className="w-4 h-4 mr-2" />
                Loyalty Program
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Program */}
        {showLoyalty && (
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Loyalty Rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Points Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{loyaltyPoints.level} Member</span>
                  <span className="text-sm text-gray-600">{loyaltyPoints.current} / {loyaltyPoints.total} points</span>
                </div>
                <Progress value={loyaltyPoints.progress} className="w-full" />
                <p className="text-sm text-gray-600">
                  {loyaltyPoints.total - loyaltyPoints.current} points until {loyaltyPoints.nextLevel}
                </p>
              </div>

              {/* Available Rewards */}
              <div>
                <h4 className="font-medium mb-3 text-gray-800">Available Rewards</h4>
                <div className="grid gap-3">
                  {loyaltyRewards.map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-3 border border-purple-200 rounded-lg bg-white/50">
                      <div>
                        <p className="font-medium text-gray-800">{reward.name}</p>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">{reward.points} points</Badge>
                        {reward.available && loyaltyPoints.current >= reward.points && (
                          <Button 
                            size="sm" 
                            onClick={() => handleClaimReward(reward.id)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          >
                            Claim
                          </Button>
                        )}
                        {!reward.available && (
                          <Badge className="bg-gray-100 text-gray-600">Coming Soon</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Plans */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative bg-white/90 backdrop-blur-sm border-purple-200 shadow-lg hover:shadow-xl transition-shadow ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    {plan.icon}
                  </div>
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-white">${plan.price}/month</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h4 className="font-medium mb-2 text-gray-800">Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-gray-800">Benefits</h4>
                  <ul className="space-y-2">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="p-6">
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(plan.id)} 
                  disabled={loading === plan.id}
                  variant={currentPlan === plan.id ? "outline" : "default"}
                  className={currentPlan === plan.id ? 
                    "w-full border-purple-300 text-purple-600 hover:bg-purple-50" : 
                    "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  }
                >
                  {loading === plan.id ? "Processing..." : 
                   currentPlan === plan.id ? "Current Plan" : "Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* VIP Services */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5" />
              <span>VIP Services</span>
            </CardTitle>
            <CardDescription className="text-white/80">
              Exclusive services for VIP members
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border border-purple-200 rounded-lg space-y-3 bg-white/50">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <h4 className="font-medium text-gray-800">Personal Matchmaker</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Get personalized dating advice and matchmaking from our expert consultants.
                </p>
                <Button onClick={handleBookMatchmaker} variant="outline" size="sm" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                  Book Consultation
                </Button>
              </div>

              <div className="p-4 border border-purple-200 rounded-lg space-y-3 bg-white/50">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <h4 className="font-medium text-gray-800">Exclusive Events</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Access to VIP-only events, parties, and exclusive dating experiences.
                </p>
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                  View Events
                </Button>
              </div>

              <div className="p-4 border border-purple-200 rounded-lg space-y-3 bg-white/50">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <h4 className="font-medium text-gray-800">Priority Support</h4>
                </div>
                <p className="text-sm text-gray-600">
                  24/7 dedicated support line for VIP members with instant response.
                </p>
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                  Contact Support
                </Button>
              </div>

              <div className="p-4 border border-purple-200 rounded-lg space-y-3 bg-white/50">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <h4 className="font-medium text-gray-800">Enhanced Safety</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Premium safety features including personal safety coordinator.
                </p>
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                  Safety Features
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Program */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5" />
              <span>Referral Program</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Earn Points for Every Friend</h3>
              <p className="text-gray-600">
                Invite friends and earn loyalty points for both you and your friend!
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">50</div>
                  <p className="text-sm text-gray-600">Points for you</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">25</div>
                  <p className="text-sm text-gray-600">Points for friend</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">∞</div>
                  <p className="text-sm text-gray-600">Unlimited referrals</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Invite Friends
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

