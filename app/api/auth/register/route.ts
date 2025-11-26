// app/api/auth/register/route.ts
import { connectDB } from '@/lib/db';
import { User } from '@/lib/schemas/user.schema';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Zod schema — strict validation
const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student']).optional().default('student'), // Only student allowed
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, password, role } = parsed.data;

    // Block any attempt to register as teacher/admin
    if (role !== 'student') {
      return NextResponse.json(
        { error: 'Only student registration is allowed.' },
        { status: 403 }
      );
    }

    // Normalize username (lowercase for consistency)
    const normalizedUsername = username.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken.' },
        { status: 409 }
      );
    }

    // Create user
    const user = new User({
      username: normalizedUsername,
      password: password,
      role: 'student',
    });

    await user.save();

    return NextResponse.json(
      {
        message: 'Student account created successfully!',
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    // Hide internal errors from user
    return NextResponse.json(
      { error: 'Registration failed. Please try again later.' },
      { status: 500 }
    );
  }
}