import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const existingUsers = await getDocs(q);

    if (!existingUsers.empty) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user document
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'member',
      membershipLevel: 'basic',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailVerified: false,
      isActive: true,
      preferences: {
        language: 'en',
        notifications: {
          email: true,
          promotions: true,
          updates: true
        }
      },
      profile: {
        profession: '',
        experience: '',
        clinic: '',
        interests: []
      }
    };

    // Add user to Firestore
    const docRef = await addDoc(usersRef, userData);

    // Return success (don't include sensitive data)
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId: docRef.id,
      user: {
        id: docRef.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        membershipLevel: userData.membershipLevel
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user account' },
      { status: 500 }
    );
  }
}