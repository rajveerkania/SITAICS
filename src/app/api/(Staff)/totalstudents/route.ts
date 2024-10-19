import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch the total number of students from the database
    const totalStudents = await prisma.studentDetails.count();
    
    // Debugging: Log the total number of students
    console.log('Total Students:', totalStudents);

    // Return the total number of students in the response
    return NextResponse.json({ totalStudents });
  } catch (error) {
    console.error('Error fetching total students:', error);

    // Return a 500 Internal Server Error response with an error message
    return NextResponse.json(
      { message: 'Error fetching total students' },
      { status: 500 }
    );
  } finally {
    // Ensure the Prisma client is properly disconnected
    await prisma.$disconnect();
  }
}
