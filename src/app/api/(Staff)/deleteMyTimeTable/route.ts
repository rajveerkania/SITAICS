import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Fetch the staff details to confirm timetable existence
    const staffDetails = await prisma.staffDetails.findUnique({
      where: { id: userId },
      select: { timetable: true },
    });

    if (!staffDetails) {
      return NextResponse.json({ message: "Staff member not found!" }, { status: 404 });
    }

    if (!staffDetails.timetable) {
      return NextResponse.json({ message: "No timetable exists to delete." }, { status: 404 });
    }

    // Update the staffDetails to remove the timetable (set to null)
    await prisma.staffDetails.update({
      where: { id: userId },
      data: { timetable: null },
    });

    return NextResponse.json({ message: "Timetable deleted successfully!", success: true });
  } catch (error: any) {
    console.error("Error deleting timetable:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
