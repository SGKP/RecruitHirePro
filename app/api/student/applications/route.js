import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request) {
  try {
    await dbConnect();

    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is a student
    if (decoded.role !== 'student') {
      return NextResponse.json(
        { error: 'Access denied. Students only.' },
        { status: 403 }
      );
    }

    // Fetch all applications for this student
    const applications = await Application.find({ student_id: decoded.userId })
      .populate('job_id')
      .sort({ applied_at: -1 }); // Most recent first

    return NextResponse.json({ 
      success: true,
      applications 
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: error.message },
      { status: 500 }
    );
  }
}
