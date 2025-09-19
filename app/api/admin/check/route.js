import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// Check if current user is admin
export async function GET(request) {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { isAdmin: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { isAdmin: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get admin email from environment (with fallback)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@notes.com';
    
    // Check if user is admin
    const isAdmin = user.email === adminEmail;

    return NextResponse.json({
      isAdmin,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { isAdmin: false, message: 'Server error' },
      { status: 500 }
    );
  }
}