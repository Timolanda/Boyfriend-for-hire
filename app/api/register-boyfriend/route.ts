import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      age, 
      bio, 
      interests, 
      availability, 
      hourlyRate,
      phoneNumber,
      email,
      address,
      emergencyContact,
      emergencyPhone,
      verificationData 
    } = body

    // Validate required fields
    if (!name || !age || !bio || !interests || !availability || !hourlyRate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate verification data
    if (!verificationData) {
      return NextResponse.json(
        { error: "Verification data is required" },
        { status: 400 }
      )
    }

    // Simulate database storage
    const boyfriendProfile = {
      id: Date.now().toString(),
      name,
      age: parseInt(age),
      bio,
      interests: interests.split(",").map((interest: string) => interest.trim()),
      availability,
      hourlyRate: parseFloat(hourlyRate),
      phoneNumber,
      email,
      address,
      emergencyContact,
      emergencyPhone,
      verificationStatus: {
        photoIdVerified: verificationData.photoIdUploaded,
        backgroundCheckConsented: verificationData.backgroundCheckConsent,
        videoVerificationCompleted: verificationData.videoVerificationCompleted,
        trustScore: verificationData.trustScore,
        isVerified: verificationData.trustScore >= 50
      },
      status: verificationData.trustScore >= 50 ? "pending_review" : "verification_required",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real application, you would:
    // 1. Store the profile in a database
    // 2. Send verification emails
    // 3. Initiate background check process
    // 4. Schedule video verification call
    // 5. Send notifications to admin team

    console.log("New boyfriend registration:", boyfriendProfile)

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      profile: boyfriendProfile
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 