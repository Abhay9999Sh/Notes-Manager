import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Note from '@/models/Note';
import { verifyToken } from '@/lib/jwt';

async function getUserFromToken(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = verifyToken(token);
  return decoded.userId;
}

// GET - Get all notes for the logged-in user
export async function GET(request) {
  try {
    await connectDB();

    const userId = await getUserFromToken(request);

    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      notes,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}

// POST - Create a new note
export async function POST(request) {
  try {
    await connectDB();

    const userId = await getUserFromToken(request);
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      );
    }

    const note = new Note({
      title,
      description,
      userId,
    });

    await note.save();

    return NextResponse.json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}