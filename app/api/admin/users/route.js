import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

async function isAdmin(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId);
  
  // Get admin email from environment (with fallback)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@notes.com';
  
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

    // Get admin email from environment (with fallback)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@notes.com';
    
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