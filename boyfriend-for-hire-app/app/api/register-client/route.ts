import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const uri = process.env.MONGODB_URI

export async function POST(req: Request) {
  if (!uri) {
    return NextResponse.json({ error: "Database connection string is not defined" }, { status: 500 })
  }

  try {
    const client = new MongoClient(uri)
    await client.connect()

    const database = client.db("boyfriend-for-hire")
    const clients = database.collection("clients")

    const { name, age, bio, interests, preferredDateTypes, email, password } = await req.json()

    const existingUser = await clients.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await clients.insertOne({
      name,
      age,
      bio,
      interests: interests.split(",").map((interest: string) => interest.trim()),
      preferredDateTypes: preferredDateTypes.split(",").map((type: string) => type.trim()),
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await client.close()

    return NextResponse.json({ message: "Client registered successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

