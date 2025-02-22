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
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Virtual Boyfriend</h1>

      <Card>
        <CardHeader>
          <CardTitle>Chat with your Virtual Boyfriend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 h-96 overflow-y-auto p-4 bg-gray-100 rounded-md">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start space-x-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar>
                    <AvatarImage src={msg.role === "user" ? "/user-avatar.png" : "/virtual-bf-avatar.png"} />
                    <AvatarFallback>{msg.role === "user" ? "U" : "VB"}</AvatarFallback>
                  </Avatar>
                  <div className={`p-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white"}`}>
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
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

