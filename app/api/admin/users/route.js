import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// Simple admin check - you can enhance this with proper role-based authentication
const ADMIN_EMAIL = 'admin@notes.com'; // Change this to your admin email

async function isAdmin(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId);
  
  // Simple admin check - you can make this more sophisticated
  return user && user.email === ADMIN_EMAIL;
}

// GET - Get all users (Admin only)
export async function GET(request) {
  try {
    await connectDB();

    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    const users = await User.find({ email: { $ne: ADMIN_EMAIL } }) // Exclude admin user
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 });

    return NextResponse.json({
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: 'Unauthorized or server error' },
      { status: 401 }
    );
  }
}