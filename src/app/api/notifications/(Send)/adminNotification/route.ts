import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { NotificationType } from '@prisma/client';
import { NotificationPayload } from '@/types/type';

export async function POST(req: Request) {
  try {
    const user = verifyToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: NotificationPayload = await req.json();
    const { type, message, courseName, batchName, subjectId, sendToAllBatches } = data;

    const sender = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    const notification = await prisma.notification.create({
      data: {
        type: type as NotificationType,
        message,
        sender: {
          connect: { id: sender.id },
        },
        course: courseName
          ? {
              connect: { courseName },
            }
          : undefined,
        batch: batchName
          ? {
              connect: { batchName },
            }
          : undefined,
        subject: subjectId
          ? {
              connect: { subjectId },
            }
          : undefined,
      },
    });

    let recipientUsers: { id: string }[] = [];
    switch (type) {
      case 'COURSE':
        if (courseName) {
          const students = await prisma.studentDetails.findMany({
            where: { courseName },
            select: { id: true },
          });
          recipientUsers = students;
        }
        break;
      case 'BATCH':
        if (batchName) {
          const students = await prisma.studentDetails.findMany({
            where: { batchName },
            select: { id: true },
          });
          recipientUsers = students;
        }
        break;
      default:
        const allUsers = await prisma.user.findMany({
          select: { id: true },
        });
        recipientUsers = allUsers;
        break;
    }

    await prisma.notificationRecipient.createMany({
      data: recipientUsers.map(({ id }) => ({
        recipientId: id, // Changed from userId to recipientId
        notificationId: notification.id,
      })),
    });
    

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}