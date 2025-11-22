import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-here-change-in-prod';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  userId: string;
  username?: string;
  role: 'admin' | 'teacher' | 'student';
  iat?: number;
  exp?: number;
}

export async function generateToken(payload: TokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(encodedKey);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function getTokenFromCookies() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  });
}

export async function getCurrentUser() {
  const token = await getTokenFromCookies();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  // If username is already in token, return payload
  if (payload.username) {
    return payload;
  }


  // Otherwise, fetch username from database
  try {
    const { connectDB } = await import('./db');
    const { User } = await import('./schemas/user.schema');

    await connectDB();
    const user = await User.findById(payload.userId).select('username');

    if (user) {
      return {
        ...payload,
        username: user.username
      };
    }
  } catch (error) {
    console.error('Error fetching username:', error);
  }

  return payload;
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}