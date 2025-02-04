import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const uri = process.env.MONGODB_URI
const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined")
}

export async function POST(req: Request) {
  if (!uri) {
    return NextResponse.json({ error: "Database connection string is not defined" }, { status: 500 })
  }

  try {
    const client = new MongoClient(uri)
    await client.connect()

    const database = client.db("boyfriend-for-hire")
    const boyfriends = database.collection("boyfriends")
    const clients = database.collection("clients")

    const { email, password } = await req.json()

    let user = await boyfriends.findOne({ email })
    let userType = "boyfriend"

    if (!user) {
      user = await clients.findOne({ email })
      userType = "client"
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = jwt.sign({ userId: user._id, email: user.email, userType }, jwtSecret, { expiresIn: "1d" })

    await client.close()

    return NextResponse.json({ token, userType })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

