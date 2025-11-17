import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/schemas/user.schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const user = await User.findById(currentUser.userId).select('-password');
    
    return NextResponse.json(
      {
        user: {
          id: user?._id,
          username: user?.username,
          role: user?.role
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
