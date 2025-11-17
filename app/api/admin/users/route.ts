import { connectDB } from '@/lib/db';
import { User } from '@/lib/schemas/user.schema';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const role = request.nextUrl.searchParams.get('role');
    const query = role ? { role } : {};
    
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    const { username, password, role, emails } = await request.json();
    
    // Bulk create if emails array provided
    if (emails && Array.isArray(emails)) {
      const users = await Promise.all(
        emails.map(async (email: string) => {
          const user = new User({
            username: email.split('@')[0],
            email,
            password: Math.random().toString(36).slice(2, 10),
            role: role || 'student'
          });
          return user.save();
        })
      );
      
      return NextResponse.json({ users, count: users.length }, { status: 201 });
    }
    
    // Single user creation
    const user = new User({ username, password, role: role || 'student' });
    await user.save();
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create users' },
      { status: 500 }
    );
  }
}
