import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';

export async function GET(req: Request) {
  try {
    const user = verifyToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notificationRecipient.findMany({
      where: {
        recipientId: user.id,
      },
      include: {
        notification: {
          select: {
            message: true, 
            sender: {
              select: {
                name: true,
                role: true,
              },
            },
            course: {
              select: {
                courseName: true,
              },
            },
            batch: {
              select: {
                batchName: true,
              },
            },
            subject: {
              select: {
                subjectName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the notifications to include sender details
    const formattedNotifications = notifications.map((notif) => ({
      id: notif.id,
      message: notif.notification.message,
      createdAt: notif.createdAt,
      status: notif.status,
      sender: notif.notification.sender,
      courseName: notif.notification.course?.courseName,
      batchName: notif.notification.batch?.batchName,
      subjectName: notif.notification.subject?.subjectName,
    }));

    return NextResponse.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
