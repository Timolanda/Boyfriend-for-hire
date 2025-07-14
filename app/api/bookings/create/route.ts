import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      boyfriendId,
      date,
      time,
      package: packageId,
      location,
      notes,
      isRecurring,
      recurringFrequency,
      useLoyaltyPoints,
      loyaltyPointsUsed
    } = body

    // Validate required fields
    if (!boyfriendId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Get user ID from authentication
    // 2. Validate boyfriend availability
    // 3. Check loyalty points balance
    // 4. Process payment
    // 5. Create booking record
    // 6. Send confirmation emails
    // 7. Update loyalty points

    // Simulate booking creation
    const bookingId = `booking-${Date.now()}`
    
    const packageDeals = {
      "first-date": {
        name: "First Date Package",
        price: 120,
        duration: 2
      },
      "weekend-getaway": {
        name: "Weekend Getaway",
        price: 300,
        duration: 6
      },
      "monthly-package": {
        name: "Monthly Package",
        price: 500,
        duration: 12
      }
    }

    const selectedPackage = packageDeals[packageId as keyof typeof packageDeals]
    const basePrice = selectedPackage ? selectedPackage.price : 120 // Default 2-hour rate

    const booking = {
      id: bookingId,
      boyfriendId,
      userId: "user-id", // This would come from authentication
      date: new Date(date).toISOString(),
      time,
      package: packageId,
      packageName: selectedPackage?.name || "Standard Date",
      location: location || "To be decided",
      notes,
      isRecurring,
      recurringFrequency,
      basePrice,
      loyaltyDiscount: useLoyaltyPoints ? 10 : 0,
      loyaltyPointsUsed: loyaltyPointsUsed || 0,
      totalPrice: basePrice - (useLoyaltyPoints ? 10 : 0),
      status: "confirmed",
      createdAt: new Date().toISOString(),
      paymentStatus: "pending"
    }

    // If recurring, create additional bookings
    const recurringBookings = []
    if (isRecurring) {
      const frequencyMap = {
        weekly: 7,
        biweekly: 14,
        monthly: 30
      }
      
      const daysToAdd = frequencyMap[recurringFrequency as keyof typeof frequencyMap] || 7
      
      for (let i = 1; i <= 3; i++) { // Create 3 additional bookings
        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + (daysToAdd * i))
        
        recurringBookings.push({
          id: `${bookingId}-recurring-${i}`,
          boyfriendId,
          userId: "user-id",
          date: nextDate.toISOString(),
          time,
          package: packageId,
          packageName: selectedPackage?.name || "Standard Date",
          location: location || "To be decided",
          notes,
          isRecurring: true,
          recurringFrequency,
          basePrice,
          loyaltyDiscount: 0, // Only apply to first booking
          loyaltyPointsUsed: 0,
          totalPrice: basePrice,
          status: "scheduled",
          createdAt: new Date().toISOString(),
          paymentStatus: "pending"
        })
      }
    }

    console.log("Booking created:", {
      bookingId,
      boyfriendId,
      package: packageId,
      totalPrice: booking.totalPrice,
      isRecurring,
      recurringCount: recurringBookings.length
    })

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      booking,
      recurringBookings,
      loyaltyPointsUpdated: useLoyaltyPoints ? loyaltyPointsUsed : 0
    })

  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
} 