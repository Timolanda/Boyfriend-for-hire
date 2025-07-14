"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { 
  Heart, 
  Star, 
  Shield, 
  Users, 
  Calendar, 
  MessageCircle, 
  Video, 
  Zap,
  ArrowRight,
  CheckCircle,
  Play,
  Award,
  Globe,
  Clock
} from "lucide-react"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("clients")

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Perfect Matches",
      description: "AI-powered matching to find your ideal companion"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified & Safe",
      description: "All boyfriends are background-checked and verified"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexible Booking",
      description: "Book dates on your schedule, no commitments"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Real Connection",
      description: "Build meaningful relationships with genuine people"
    }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      age: 28,
      location: "New York",
      rating: 5,
      text: "I was skeptical at first, but the quality of matches is incredible. Found my perfect date for the company gala!",
      avatar: "SM"
    },
    {
      name: "Jessica L.",
      age: 31,
      location: "Los Angeles",
      rating: 5,
      text: "The safety features give me peace of mind. My boyfriend was charming, respectful, and exactly what I needed.",
      avatar: "JL"
    },
    {
      name: "Emma R.",
      age: 26,
      location: "Chicago",
      rating: 5,
      text: "Perfect for busy professionals! Booked a date for my sister's wedding and he was absolutely perfect.",
      avatar: "ER"
    }
  ]

  const stats = [
    { number: "10,000+", label: "Happy Clients" },
    { number: "500+", label: "Verified Boyfriends" },
    { number: "50+", label: "Cities Covered" },
    { number: "4.9/5", label: "Average Rating" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-pink-100 text-pink-800 hover:bg-pink-100">
              <Heart className="w-4 h-4 mr-2" />
              Trusted by 10,000+ clients
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Find Your Perfect
              <br />
              <span className="text-4xl md:text-6xl">Boyfriend for Hire</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with verified, charming companions for any occasion. 
              From dinner dates to wedding plus-ones, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register/client">
                <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register/boyfriend">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Become a Boyfriend
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Boyfriend for Hire?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make dating simple, safe, and satisfying with our unique approach
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get your perfect date in just 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Choose</h3>
              <p className="text-gray-600">
                Browse our verified boyfriends and find your perfect match
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Your Date</h3>
              <p className="text-gray-600">
                Choose your date, time, and location. We handle the rest
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Time</h3>
              <p className="text-gray-600">
                Relax and enjoy your perfect date with your chosen companion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real people who found their perfect match
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.age} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who found their ideal companion. 
            Start your journey today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register/client">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/find-match">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600">
                Browse Boyfriends
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">💕 Boyfriend for Hire</h3>
              <p className="text-gray-400">
                Making dating simple, safe, and satisfying.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/find-match" className="hover:text-white">Find a Match</Link></li>
                <li><Link href="/safety-center" className="hover:text-white">Safety Center</Link></li>
                <li><Link href="/subscription" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Boyfriends</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register/boyfriend" className="hover:text-white">Apply Now</Link></li>
                <li><Link href="/profile/1" className="hover:text-white">View Profile</Link></li>
                <li><Link href="/messages" className="hover:text-white">Messages</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy-settings" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/safety-center" className="hover:text-white">Safety</Link></li>
                <li><Link href="/virtual-boyfriend" className="hover:text-white">Virtual Boyfriend</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Boyfriend for Hire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

