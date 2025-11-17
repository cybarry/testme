import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface TokenPayload {
  userId: string;
  role: 'admin' | 'teacher' | 'student';
}

export async function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60
  });
}

export async function getCurrentUser() {
  const token = await getTokenFromCookies();
  if (!token) return null;
  return await verifyToken(token);
}
