import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const {
            staffId,
            email,
            name,
            gender,
            address,
            city,
            state,
            pinCode,
            contactNo,
            achievements,
            dateOfBirth,
} =reqBody
const parsedDateOfBirth = new Date(dateOfBirth);
    
    parsedDateOfBirth.setHours(0, 0, 0, 0);
}
    
catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}