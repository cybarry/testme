// app/api/auth/login/route.ts
import { connectDB } from '@/lib/db';
import { User } from '@/lib/schemas/user.schema';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Optional: If you still want to use your generateToken & setAuthCookie
import { generateToken, setAuthCookie } from '@/lib/auth';

// Zod validation
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    // Find user (case-insensitive)
    const user = await User.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token (your existing function)
    const token = await generateToken({
      userId: user._id.toString(),
      role: user.role,
      username: user.username,
    });

    // Create response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set secure HttpOnly cookie
    await setAuthCookie(token, response); // pass response if needed

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again later.' },
      { status: 500 }
    );
  }
}