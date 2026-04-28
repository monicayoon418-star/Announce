import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isOperatorRoute =
      req.nextUrl.pathname.startsWith('/operator/dashboard') ||
      req.nextUrl.pathname.startsWith('/operator/events')

    if (isOperatorRoute && (!token || token.role !== 'operator')) {
      return NextResponse.redirect(new URL('/operator/login', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req }) => {
        if (
          req.nextUrl.pathname === '/operator/login' ||
          req.nextUrl.pathname === '/operator/register'
        )
          return true
        return true
      },
    },
  }
)

export const config = { matcher: ['/operator/:path*'] }
