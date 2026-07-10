import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/auth/signin', '/auth/signup', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder images (e.g. .png, .jpg)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
