import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MenuIcon } from "lucide-react"
import { ReactNode } from 'react';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Boyfriend for Hire',
  description: 'Find your perfect match with Boyfriend for Hire',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-background-foreground`}>
        <header className="bg-primary p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                💕 Boyfriend for Hire
              </h1>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="hover:bg-primary/10 bg-white/10 border-white/20 text-white">
                  <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/find-match" className="w-full cursor-pointer">
                    Find a Match
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/messages" className="w-full cursor-pointer">
                    Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/safety-center" className="w-full cursor-pointer">
                    Safety Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/virtual-boyfriend" className="w-full cursor-pointer">
                    Virtual Boyfriend
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="w-full cursor-pointer">
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/privacy-settings" className="w-full cursor-pointer">
                    Privacy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register/boyfriend" className="w-full cursor-pointer">
                    Register as Boyfriend
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register/client" className="w-full cursor-pointer">
                    Register as Client
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <Button className="fixed bottom-6 right-6 rounded-full w-16 h-16 text-3xl shadow-lg hover:scale-110 transition-transform" variant="default">
          <Link href="/quick-book" className="w-full h-full flex items-center justify-center">+</Link>
        </Button>
      </body>
    </html>
  )
}
