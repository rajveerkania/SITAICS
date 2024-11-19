import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1]; 
  const decodedUser = await verifyToken(token);

  if (decodedUser?.role !== "Staff") {
    return NextResponse.json({ error: "Access Denied!" }, { status: 403 });
  }

  const { type, recipient, message, class: selectedClass, subject: selectedSubject } = await request.json();

  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        message,
        senderId: decodedUser.id,
        courseName: type === "COURSE" ? selectedClass : undefined,
        batchName: type === "CLASS" ? selectedClass : undefined,
        subjectId: type === "SUBJECT" ? selectedSubject : undefined,
      },
    });

    const recipients = await prisma.notificationRecipient.createMany({
      data: recipient.split(",").map((id: string) => ({
        notificationId: notification.id,
        recipientId: id.trim(),
      })),
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}