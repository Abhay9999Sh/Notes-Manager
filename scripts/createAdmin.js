// Admin User Creation Script
// Run this with: npm run create-admin

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../lib/dbConnect.js';

// Define User schema directly in this script
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const createAdminUser = async () => {
  try {
    await connectDB();
    
    const adminEmail = 'admin@notes.com';
    const adminPassword = 'admin123'; // Change this to a secure password
    const adminName = 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
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
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Please change the password after first login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();