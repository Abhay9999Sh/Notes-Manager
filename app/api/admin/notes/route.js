import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Note from '@/models/Note';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// Simple admin check
const ADMIN_EMAIL = 'admin@notes.com'; // Change this to your admin email

async function isAdmin(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId);
  
  return user && user.email === ADMIN_EMAIL;
}

// GET - Get all notes from all users (Admin only)
export async function GET(request) {
  try {
    await connectDB();

    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    const notes = await Note.find({})
      .populate('userId', 'name email') // Include user info
      .sort({ createdAt: -1 });

    // Filter out notes from admin user
    const filteredNotes = notes.filter(note => note.userId?.email !== ADMIN_EMAIL);

    return NextResponse.json({
      notes: filteredNotes,
    });
  } catch (error) {
    console.error('Get all notes error:', error);
    return NextResponse.json(
      { message: 'Unauthorized or server error' },
      { status: 401 }
    );
  }
}