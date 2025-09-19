import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Note from '@/models/Note';
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

// DELETE - Delete any note (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    const { id } = params;

    const note = await Note.findByIdAndDelete(id);
    
    if (!note) {
      return NextResponse.json(
        { message: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Note deleted successfully by admin',
    });
  } catch (error) {
    console.error('Admin delete note error:', error);
    return NextResponse.json(
      { message: 'Unauthorized or server error' },
      { status: 401 }
    );
  }
}