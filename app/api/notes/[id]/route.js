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

// PUT - Update a note
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const userId = await getUserFromToken(request);
    const { id } = params;
    const { title, description } = await request.json();

    // Find note and check ownership
    const note = await Note.findOne({ _id: id, userId });
    
    if (!note) {
      return NextResponse.json(
        { message: 'Note not found' },
        { status: 404 }
      );
    }

    // Update note
    note.title = title || note.title;
    note.description = description || note.description;
    
    await note.save();

    return NextResponse.json({
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}

// DELETE - Delete a note
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const userId = await getUserFromToken(request);
    const { id } = params;

    // Find and delete note (only if user owns it)
    const note = await Note.findOneAndDelete({ _id: id, userId });
    
    if (!note) {
      return NextResponse.json(
        { message: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}