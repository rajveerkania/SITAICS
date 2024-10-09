import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        studentDetails: true,
        staffDetails: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        username: body.username,
        role: body.role,
        isActive: body.isActive,
        studentDetails: body.studentDetails ? {
          update: body.studentDetails
        } : undefined,
        staffDetails: body.staffDetails ? {
          update: body.staffDetails
        } : undefined,
      },
      include: {
        studentDetails: true,
        staffDetails: true,
      },
    });

    
    const { password, ...safeUser } = updatedUser;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error updating user details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}