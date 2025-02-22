"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import loadStripe from "stripe"

const plans = [
  { id: "basic", name: "Basic", price: 9.99, features: ["5 matches per month", "Basic chat"] },
  { id: "premium", name: "Premium", price: 19.99, features: ["Unlimited matches", "Video dates", "Priority support"] },
  {
    id: "vip",
    name: "VIP",
    price: 39.99,
    features: ["All Premium features", "Personal matchmaker", "Exclusive events"],
  },
]

export default function Subscription() {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

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
      await stripe?.redirectToCheckout({ sessionId })
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Choose Your Plan</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>${plan.price}/month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubscribe(plan.id)} disabled={loading === plan.id}>
                {loading === plan.id ? "Processing..." : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

