"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { 
  Send, 
  Mic, 
  Phone, 
  Video, 
  Smile, 
  Paperclip, 
  MoreVertical,
  Play,
  Pause,
  Volume2,
  Languages,
  Heart,
  ThumbsUp,
  MessageCircle
} from "lucide-react"
import Sentiment from "sentiment"

const sentiment = new Sentiment()

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  type: "text" | "voice" | "gif" | "image"
  reactions?: string[]
  translated?: string
  isTranslated?: boolean
}

interface Chat {
  id: number
  name: string
  image: string
  lastMessage: string
  isOnline: boolean
  lastSeen: string
  unreadCount: number
}

const mockChats: Chat[] = [
  {
    id: 1,
    name: "John",
    image: "/placeholder.svg?height=50&width=50",
    lastMessage: "Hey, are we still on for tomorrow?",
    isOnline: true,
    lastSeen: "2 minutes ago",
    unreadCount: 2
  },
  { 
    id: 2, 
    name: "Mike", 
    image: "/placeholder.svg?height=50&width=50", 
    lastMessage: "I had a great time yesterday!", 
    isOnline: false,
    lastSeen: "1 hour ago",
    unreadCount: 0
  },
  { 
    id: 3, 
    name: "Alex", 
    image: "/placeholder.svg?height=50&width=50", 
    lastMessage: "What kind of music do you like?", 
    isOnline: true,
    lastSeen: "5 minutes ago",
    unreadCount: 1
  },
]

const mockMessages: Message[] = [
  { id: 1, sender: "John", content: "Hey, how are you doing?", timestamp: "10:30 AM", type: "text" },
  { id: 2, sender: "You", content: "I'm good, thanks! How about you?", timestamp: "10:32 AM", type: "text" },
  { id: 3, sender: "John", content: "I'm doing great! Are we still on for our date tomorrow?", timestamp: "10:35 AM", type: "text" },
  { id: 4, sender: "You", content: "I'm looking forward to it.", timestamp: "10:36 AM", type: "text" },
  { id: 5, sender: "John", content: "voice-message-1.mp3", timestamp: "10:38 AM", type: "voice" },
]

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<Chat>(mockChats[0])
  const [newMessage, setNewMessage] = useState("")
  const [conversationStarters, setConversationStarters] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [overallSentiment, setOverallSentiment] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
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
    const textMessages = messages.filter(msg => msg.type === "text")
    if (textMessages.length > 0) {
      const sentimentSum = textMessages.reduce((sum, message) => {
        const result = sentiment.analyze(message.content)
        return sum + result.score
      }, 0)
      setOverallSentiment(sentimentSum / textMessages.length)
    }
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObj: Message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text"
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

  const handleVoiceMessage = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        const chunks: Blob[] = []

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" })
          const audioUrl = URL.createObjectURL(blob)
          
          const newMessageObj: Message = {
            id: messages.length + 1,
            sender: "You",
            content: audioUrl,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "voice"
          }
          setMessages([...messages, newMessageObj])
        }

        mediaRecorder.start()
        setIsRecording(true)
        setRecordingTime(0)
        
        const interval = setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)

        mediaRecorder.onstop = () => {
          clearInterval(interval)
          setIsRecording(false)
          setRecordingTime(0)
        }
      } catch (error) {
        console.error("Error accessing microphone:", error)
        toast({
          title: "Microphone Access",
          description: "Please allow microphone access to record voice messages.",
          variant: "destructive",
        })
      }
    } else {
      mediaRecorderRef.current?.stop()
      mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop())
    }
  }

  const handleVideoCall = () => {
    setIsVideoCallActive(!isVideoCallActive)
    toast({
      title: isVideoCallActive ? "Call Ended" : "Call Started",
      description: isVideoCallActive ? "Video call has ended." : "Initiating video call...",
    })
  }

  const handleReaction = (messageId: number, reaction: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
        : msg
    ))
  }

  const handleTranslate = async (messageId: number) => {
    try {
      const message = messages.find(msg => msg.id === messageId)
      if (!message) return

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message.content, targetLanguage: "es" })
      })

      if (response.ok) {
        const { translatedText } = await response.json()
        setMessages(messages.map(msg => 
          msg.id === messageId 
            ? { ...msg, translated: translatedText, isTranslated: true }
            : msg
        ))
      }
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation Failed",
        description: "Unable to translate message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUseConversationStarter = (starter: string) => {
    setNewMessage(starter)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Chat List */}
        <div className="w-1/3 border-r border-purple-200 bg-white/80 backdrop-blur-sm">
          <div className="p-4 border-b border-purple-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Messages
            </h2>
          </div>
          <ScrollArea className="h-full">
            {mockChats.map((chat) => (
              <Card
                key={chat.id}
                className={`m-2 cursor-pointer hover:bg-purple-50 transition-colors border-purple-200 ${
                  selectedChat.id === chat.id ? "bg-purple-100 border-purple-300" : "bg-white/90"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="ring-2 ring-purple-200">
                      <AvatarImage src={chat.image} alt={chat.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                        {chat.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate text-gray-800">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.lastSeen}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                      <Badge className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-grow flex flex-col bg-white/60 backdrop-blur-sm">
          {/* Chat Header */}
          <div className="p-4 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="ring-2 ring-white/30">
                  <AvatarImage src={selectedChat.image} alt={selectedChat.name} />
                  <AvatarFallback className="bg-white/20 text-white font-semibold">
                    {selectedChat.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{selectedChat.name}</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${selectedChat.isOnline ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-white/80">
                      {selectedChat.isOnline ? 'Online' : `Last seen ${selectedChat.lastSeen}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleVideoCall} className="border-white/30 text-white hover:bg-white/20">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sentiment Indicator */}
          <div className="px-4 py-2 bg-purple-50/80 border-b border-purple-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Conversation Sentiment:</span>
              <Badge className={overallSentiment > 0 ? "bg-green-500 text-white" : overallSentiment < 0 ? "bg-red-500 text-white" : "bg-gray-500 text-white"}>
                {overallSentiment > 0 ? "😊 Positive" : overallSentiment < 0 ? "😔 Negative" : "😐 Neutral"}
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-grow p-4">
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.sender === "You" ? "text-right" : ""}`}>
                <div className={`inline-block max-w-xs lg:max-w-md ${message.sender === "You" ? "text-right" : ""}`}>
                  <div className={`p-3 rounded-lg ${
                    message.sender === "You" 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                      : "bg-white/90 border border-purple-200"
                  }`}>
                    {message.type === "voice" ? (
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Play className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 bg-white/20 rounded-full h-2">
                          <div className="bg-white h-2 rounded-full w-1/3"></div>
                        </div>
                        <span className="text-xs">0:15</span>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                    
                    {message.isTranslated && message.translated && (
                      <div className="mt-2 p-2 bg-white/20 rounded text-sm">
                        <p className="text-white/90">{message.translated}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">{message.timestamp}</span>
                      <div className="flex items-center space-x-1">
                        {message.reactions?.map((reaction, index) => (
                          <span key={index} className="text-xs">{reaction}</span>
                        ))}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleReaction(message.id, "❤️")}
                          className="text-white hover:bg-white/20"
                        >
                          <Heart className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleReaction(message.id, "👍")}
                          className="text-white hover:bg-white/20"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        {message.type === "text" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleTranslate(message.id)}
                            className="text-white hover:bg-white/20"
                          >
                            <Languages className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-purple-200 space-y-4 bg-white/80">
            {/* Conversation Starters */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Conversation Starters:</h3>
              <ScrollArea className="h-20">
                <div className="flex space-x-2">
                  {conversationStarters.slice(0, 5).map((starter, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap border-purple-300 text-purple-600 hover:bg-purple-50"
                      onClick={() => handleUseConversationStarter(starter)}
                    >
                      {starter}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowGifPicker(!showGifPicker)} className="border-purple-300 text-purple-600 hover:bg-purple-50">
                <Smile className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button 
                variant={isRecording ? "destructive" : "outline"} 
                size="sm"
                onClick={handleVoiceMessage}
                className={isRecording ? "bg-red-500 hover:bg-red-600" : "border-purple-300 text-purple-600 hover:bg-purple-50"}
              >
                <Mic className="w-4 h-4" />
                {isRecording && <span className="ml-1">{formatTime(recordingTime)}</span>}
              </Button>
              <Button onClick={handleSendMessage} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* GIF Picker */}
            {showGifPicker && (
              <div className="p-4 border border-purple-200 rounded-lg bg-white/90">
                <div className="grid grid-cols-4 gap-2">
                  {["😊", "❤️", "🎉", "👍", "😍", "😂", "🤔", "😭"].map((gif, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewMessage(prev => prev + gif)
                        setShowGifPicker(false)
                      }}
                      className="hover:bg-purple-50"
                    >
                      {gif}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Call Overlay */}
        {isVideoCallActive && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Video Call with {selectedChat.name}</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg h-48 flex items-center justify-center border-2 border-purple-200">
                  <Video className="w-12 h-12 text-purple-500" />
                </div>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={handleVideoCall} className="border-purple-300 text-purple-600 hover:bg-purple-50">
                    <Phone className="w-4 h-4 mr-2" />
                    End Call
                  </Button>
                  <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Mute
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

