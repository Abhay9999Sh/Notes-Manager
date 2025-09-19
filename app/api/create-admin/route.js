import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/dbConnect';
import User from '@/models/User';

// One-time admin creation endpoint
// Visit: http://localhost:3000/api/create-admin to create admin user
export async function POST() {
  try {
    await connectDB();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@notes.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists!' },
        { status: 200 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
    });

    await admin.save();
    
    return NextResponse.json({
      message: 'Admin user created successfully!',
      email: adminEmail,
      password: process.env.NODE_ENV === 'production' ? '***hidden***' : adminPassword,
      note: process.env.NODE_ENV === 'production' 
        ? 'Admin created with environment credentials. Keep them secure!' 
        : 'Please change the password after first login.'
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { message: 'Error creating admin user', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Send a POST request to create admin user',
    instructions: 'Use a tool like Postman or curl to send POST request to this endpoint'
  });
}