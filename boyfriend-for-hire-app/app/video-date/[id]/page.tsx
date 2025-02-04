"use client"

import { useState, useRef } from "react"
import Webcam from "react-webcam"
import { Button } from "@/components/ui/button"

export default function VideoDate({ params }: { params: { id: string } }) {
  const [isCallStarted, setIsCallStarted] = useState(false)
  const webcamRef = useRef<Webcam>(null)

  const startCall = () => {
    setIsCallStarted(true)
    // In a real app, you would initiate a WebRTC connection here
  }

  const endCall = () => {
    setIsCallStarted(false)
    // In a real app, you would terminate the WebRTC connection here
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Video Date with Match #{params.id}</h1>

      <div className="aspect-video bg-gray-200 relative">
        {isCallStarted ? (
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p>Camera off</p>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        {!isCallStarted ? (
          <Button onClick={startCall}>Start Call</Button>
        ) : (
          <Button onClick={endCall} variant="destructive">
            End Call
          </Button>
        )}
      </div>
    </div>
  )
}

