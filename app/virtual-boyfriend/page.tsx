"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VirtualBoyfriend() {
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([])

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { role: "user", content: message }
    setConversation([...conversation, userMessage])
    setMessage("")

    try {
      const response = await fetch("/api/virtual-boyfriend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      setConversation((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Virtual Boyfriend
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience companionship and conversation with your AI-powered virtual boyfriend
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg max-w-4xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-xl">Chat with your Virtual Boyfriend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-4 h-96 overflow-y-auto p-4 bg-purple-50/50 rounded-md border border-purple-200">
              {conversation.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>Start a conversation with your virtual boyfriend!</p>
                </div>
              )}
              {conversation.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start space-x-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="ring-2 ring-purple-200">
                      <AvatarImage src={msg.role === "user" ? "/user-avatar.png" : "/virtual-bf-avatar.png"} />
                      <AvatarFallback className={msg.role === "user" ? "bg-purple-500 text-white" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"}>
                        {msg.role === "user" ? "U" : "VB"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                      msg.role === "user" 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                        : "bg-white border border-purple-200 text-gray-800"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <Button 
                onClick={sendMessage}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

