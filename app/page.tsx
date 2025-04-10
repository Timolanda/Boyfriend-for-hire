import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const featuredProfiles = [
  { id: 1, name: "John", image: "/placeholder.svg?height=100&width=100", rating: 4.8 },
  { id: 2, name: "Mike", image: "/placeholder.svg?height=100&width=100", rating: 4.9 },
  { id: 3, name: "Alex", image: "/placeholder.svg?height=100&width=100", rating: 4.7 },
]

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Boyfriends of the Week</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {featuredProfiles.map((profile) => (
            <Card key={profile.id} className="w-64 flex-shrink-0">
              <CardContent className="p-4 flex flex-col items-center space-y-2">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.image} alt={profile.name} />
                  <AvatarFallback>{profile.name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">Rating: {profile.rating}</p>
                <Link href={`/profile/${profile.id}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Link href="/find-match">
          <Button className="w-full h-24 text-lg" variant="secondary">
            Find a Match
          </Button>
        </Link>
        <Link href="/bookings">
          <Button className="w-full h-24 text-lg" variant="secondary">
            My Bookings
          </Button>
        </Link>
        <Link href="/messages">
          <Button className="w-full h-24 text-lg" variant="secondary">
            Messages
          </Button>
        </Link>
        <Link href="/safety-center">
          <Button className="w-full h-24 text-lg" variant="secondary">
            Safety Center
          </Button>
        </Link>
      </section>

      <Button className="fixed bottom-6 right-6 rounded-full w-16 h-16 text-3xl" variant="accent">
        +
      </Button>
    </div>
  )
}

