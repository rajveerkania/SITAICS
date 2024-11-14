import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';

export async function POST(req: Request) {
  try {
    const user = verifyToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId } = await req.json();

    // Step 1: Check if the notification recipient exists
    const notificationRecipient = await prisma.notificationRecipient.findUnique({
      where: {
        notificationId_recipientId: {
          notificationId,
          recipientId: user.id,
        },
      },
    });

    if (!notificationRecipient) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Step 2: Mark the notification as read
    await prisma.notificationRecipient.update({
      where: {
        notificationId_recipientId: {
          notificationId,
          recipientId: user.id,
        },
      },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
  }
}
