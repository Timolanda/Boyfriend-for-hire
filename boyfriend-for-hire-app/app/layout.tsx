import type React from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MenuIcon } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-background-foreground`}>
        <header className="bg-primary p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold">Boyfriend for Hire</h1>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/find-match">Find a Match</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/messages">Messages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/safety-center">Safety Center</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/virtual-boyfriend">Virtual Boyfriend</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/subscription">Subscription</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/privacy-settings">Privacy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/register/boyfriend">Register as Boyfriend</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/register/client">Register as Client</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <Button className="fixed bottom-6 right-6 rounded-full w-16 h-16 text-3xl" variant="accent">
          <Link href="/quick-book">+</Link>
        </Button>
      </body>
    </html>
  )
}

