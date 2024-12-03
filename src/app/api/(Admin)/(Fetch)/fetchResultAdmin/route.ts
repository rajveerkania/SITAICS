import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
  
    if (!studentId) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
    }
  
    try {
      // Fetch the results of the specific student
      const results = await prisma.result.findMany({
        where: { studentId },
        include: {
          student: { select: { name: true } },
        },
      });
  
      // Format results to include relevant information
      const formattedResults = results.map((result) => ({
        id: result.id,
        studentName: result.student.name,
        semester: result.semester,
        url: result.resultFile.toString("base64"),
      }));
  
      return NextResponse.json(formattedResults, { status: 200 });
    } catch (error) {
      console.error("Error fetching student results:", error);
      return NextResponse.json(
        { error: "Failed to fetch student results" },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  