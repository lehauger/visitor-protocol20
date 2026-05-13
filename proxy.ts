import { auth } from '@/auth'

export const proxy = auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/visits/:path*', '/register/:path*', '/invite/:path*', '/admin/:path*'],
}
