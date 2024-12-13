import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { NotificationType } from '@prisma/client';
import cron from 'node-cron';

interface StaffNotificationPayload {
  type: 'batch' | 'subject';
  message: string;
  batchId: string;
  subjectId?: string;
}

function mapToNotificationType(type: string): NotificationType {
  const typeMap: Record<string, NotificationType> = {
    'batch': NotificationType.BATCH,
    'subject': NotificationType.SUBJECT
  };
  return typeMap[type] || NotificationType.SPECIFIC;
}

export async function POST(req: Request) {
  try {
    const user = verifyToken();
    if (!user) {
      console.log('Authentication failed: No user token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const staffMember = await prisma.staffDetails.findUnique({
      where: { id: user.id },
      include: {
        subjects: {
          select: {
            subjectId: true,
            subjectName: true
          }
        },
        batch: true,
      },
    });

    if (!staffMember) {
      console.log('Staff member not found for user ID:', user.id);
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    const data: StaffNotificationPayload = await req.json();
    const { type, message, batchId, subjectId } = data;

    console.log('Received notification data:', {
      type,
      batchId,
      subjectId,
      staffId: user.id
    });

    const batch = await prisma.batch.findUnique({
      where: { batchId },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!batch) {
      console.log('Batch not found:', batchId);
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const isBatchCoordinator = staffMember.batch?.batchId === batchId;
    
    if (type === 'subject' && subjectId) {
      const staffSubjects = staffMember.subjects.map(sub => sub.subjectId);
      console.log('Staff subjects:', staffSubjects);
      console.log('Requested subject:', subjectId);
      
      const hasSubjectAccess = staffMember.subjects.some(subject => subject.subjectId === subjectId);
      
      if (!hasSubjectAccess && !isBatchCoordinator) {
        console.log('Access denied: Staff does not teach subject and is not batch coordinator');
        return NextResponse.json({ 
          error: 'Unauthorized to send notifications for this subject',
          details: {
            staffSubjects: staffSubjects,
            requestedSubject: subjectId,
            isBatchCoordinator
          }
        }, { status: 403 });
      }
    }

    const notification = await prisma.notification.create({
      data: {
        type: mapToNotificationType(type),
        message,
        sender: {
          connect: { id: user.id },
        },
        batch: {
          connect: { batchName: batch.batchName },
        },
        ...(subjectId && {
          subject: {
            connect: { subjectId },
          },
        }),
      },
    });

    const recipients = await prisma.studentDetails.findMany({
      where: {
        batchName: batch.batchName,
        ...(type === 'subject' && subjectId
          ? {
              OR: [
                {
                  electiveChoices: {
                    some: {
                      subjectId,
                    },
                  },
                },
                {
                  course: {
                    subjects: {
                      some: {
                        subjectId,
                        isElective: false,
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      select: { id: true },
    });

    console.log(`Found ${recipients.length} recipients for notification`);

    if (recipients.length > 0) {
      await prisma.notificationRecipient.createMany({
        data: recipients.map(({ id }) => ({
          recipientId: id,
          notificationId: notification.id,
        })),
      });
    }

    // Schedule a cron job to send the notification after 24 hours
    cron.schedule('0 0 0 * * *', async () => {
      console.log('Running scheduled task to send notifications after 24 hours');

      await prisma.notificationRecipient.createMany({
        data: recipients.map(({ id }) => ({
          recipientId: id,
          notificationId: notification.id,
        })),
      });

      console.log('Scheduled notification sent successfully');
    });

    return NextResponse.json({ 
      success: true,
      message: 'Notification scheduled to be sent in 24 hours',
      notification: {
        id: notification.id,
        type: mapToNotificationType(type),
        message,
        recipientCount: recipients.length,
      }
    });

  } catch (error) {
    console.error('Error sending staff notification:', error);
    return NextResponse.json({ 
      error: 'Failed to send notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
