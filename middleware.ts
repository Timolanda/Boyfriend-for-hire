// Simplified middleware for now - can be enhanced later
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, just pass through all requests
  // This can be enhanced later for proper i18n routing
  return NextResponse.next()
}

export const config = {
  // Only run middleware on specific paths if needed
  matcher: []
} 