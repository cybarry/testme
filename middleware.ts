import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // If no token and not public route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If token exists, verify it
  if (token) {
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      // Token invalid, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
    
    // Check role-based routing
    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    if (pathname.startsWith('/teacher') && decoded.role !== 'teacher' && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    if (pathname.startsWith('/student') && decoded.role !== 'student' && decoded.role !== 'admin' && decoded.role !== 'teacher') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  // Allow public routes to be accessed
  if (isPublicRoute && token) {
    const decoded = await verifyToken(token);
    if (decoded) {
      // Redirect authenticated users away from login/register
      return NextResponse.redirect(new URL(`/${decoded.role}/dashboard`, request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
