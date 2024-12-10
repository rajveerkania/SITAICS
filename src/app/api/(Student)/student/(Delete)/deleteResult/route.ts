import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON body
    const { id } = await req.json();
    console.log(id);
    // Validate that the ID is provided
    if (!id) {

      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    // Attempt to delete the result using Prisma
    const deletedResult = await prisma.result.delete({
      where: { id }, // Using the ID to delete the corresponding result
    });

    // Return a success response if deletion was successful
    return NextResponse.json({ success: true, message: "Result deleted successfully", deletedResult }, { status: 200 });
  } catch (error) {
    console.error("Error deleting result:", error);

    // Return an error response for any other issues
    return NextResponse.json({ success: false, message: "Error deleting result" }, { status: 500 });
  }
}
