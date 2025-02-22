"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import Sentiment from "sentiment"

const sentiment = new Sentiment()

const mockChats = [
  {
    id: 1,
    name: "John",
    image: "/placeholder.svg?height=50&width=50",
    lastMessage: "Hey, are we still on for tomorrow?",
  },
  { id: 2, name: "Mike", image: "/placeholder.svg?height=50&width=50", lastMessage: "I had a great time yesterday!" },
  { id: 3, name: "Alex", image: "/placeholder.svg?height=50&width=50", lastMessage: "What kind of music do you like?" },
]

const mockMessages = [
  { id: 1, sender: "John", content: "Hey, how are you doing?", timestamp: "10:30 AM" },
  { id: 2, sender: "You", content: "I'm good, thanks! How about you?", timestamp: "10:32 AM" },
  { id: 3, sender: "John", content: "I'm doing great! Are we still on for our date tomorrow?", timestamp: "10:35 AM" },
  { id: 4, sender: "You", content: "I'm looking forward to it.", timestamp: "10:36 AM" },
]

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0])
  const [newMessage, setNewMessage] = useState("")
  const [conversationStarters, setConversationStarters] = useState<string[]>([])
  const [messages, setMessages] = useState(mockMessages)
  const [overallSentiment, setOverallSentiment] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const fetchConversationStarters = async () => {
      try {
        const response = await fetch("/api/conversation-starters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userProfile: {
              interests: ["hiking", "photography", "cooking"],
              age: 28,
              occupation: "Software Engineer",
            },
            matchProfile: {
              interests: ["travel", "music", "art"],
              age: 30,
              occupation: "Graphic Designer",
            },
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch conversation starters")
        }

        const data = await response.json()
        setConversationStarters(data.conversationStarters)
      } catch (error) {
        console.error("Error fetching conversation starters:", error)
        toast({
          title: "Error",
          description: "Failed to fetch conversation starters. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchConversationStarters()
  }, [toast])

  useEffect(() => {
    // Calculate overall sentiment
    const sentimentSum = messages.reduce((sum, message) => {
      const result = sentiment.analyze(message.content)
      return sum + result.score
    }, 0)
    setOverallSentiment(sentimentSum / messages.length)
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObj = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessageObj])
      setNewMessage("")

      // Analyze sentiment
      const result = sentiment.analyze(newMessage)
      if (result.score < -2) {
        toast({
          title: "Sentiment Alert",
          description: "Your message seems quite negative. Consider rephrasing it more positively.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUseConversationStarter = (starter: string) => {
    setNewMessage(starter)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <div className="w-1/3 border-r">
        <h2 className="text-2xl font-bold p-4">Chats</h2>
        <ScrollArea className="h-full">
          {mockChats.map((chat) => (
            <Card
              key={chat.id}
              className={`m-2 cursor-pointer ${selectedChat.id === chat.id ? "bg-accent" : ""}`}
              onClick={() => setSelectedChat(chat)}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={chat.image} alt={chat.name} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h3 className="font-semibold">{chat.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-grow flex flex-col">
        <h2 className="text-2xl font-bold p-4">Chat with {selectedChat.name}</h2>
        <div className="text-sm text-muted-foreground px-4">
          Overall Sentiment: {overallSentiment > 0 ? "Positive" : overallSentiment < 0 ? "Negative" : "Neutral"}
        </div>
        <ScrollArea className="flex-grow p-4">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === "You" ? "text-right" : ""}`}>
              <div
                className={`inline-block p-2 rounded-lg ${message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-accent"}`}
              >
                <p>{message.content}</p>
                <p className="text-xs text-muted-foreground">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Conversation Starters:</h3>
            <ScrollArea className="h-24">
              {conversationStarters.map((starter, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start mb-2 text-left"
                  onClick={() => handleUseConversationStarter(starter)}
                >
                  {starter}
                </Button>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

