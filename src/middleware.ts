import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const payload = session ? await decrypt(session) : null

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/walikelas')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (payload.role !== 'walikelas') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (request.nextUrl.pathname === '/login') {
    if (payload) {
      if (payload.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      } else if (payload.role === 'walikelas') {
        return NextResponse.redirect(new URL('/walikelas/dashboard', request.url))
      }
    }
  }

  if (request.nextUrl.pathname === '/') {
    if (payload) {
      if (payload.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      } else if (payload.role === 'walikelas') {
        return NextResponse.redirect(new URL('/walikelas/dashboard', request.url))
      }
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
}
