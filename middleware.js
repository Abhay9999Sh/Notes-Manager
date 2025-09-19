import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // Protected routes
  const protectedRoutes = ['/dashboard'];
  
  const { pathname } = request.nextUrl;

  // Only redirect to login if accessing dashboard without token
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    console.log('Middleware: No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
};