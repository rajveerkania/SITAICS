import { connect } from "@/database/mongo.config";
import { StudentDetails } from "@/models/Student";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { student_id,  enrollmentNumber, course, address, bloodGroup, dateOfBirth, achievement, contactNumber } = reqBody;
        console.log("Request Body:", reqBody);

        // Convert student_id to ObjectId if it's a string
        const studentIdObject = typeof student_id === 'string' ? new mongoose.Types.ObjectId(student_id) : student_id;

        const updatedStudentDetails = await StudentDetails.findOneAndUpdate(
            { student_id },
            {
                $set: {
                    student_id: studentIdObject,
                     
                    enrollmentNumber,
                    course,
                    address,
                    bloodGroup,
                    dateOfBirth: new Date(dateOfBirth), // Convert string to Date object
                    achievement,
                    contactNumber
                }
            },
            { 
                new: true,
                runValidators: true,
                upsert: true // Changed to true to create a new document if not found
            }
        );

        if (updatedStudentDetails) {
            console.log("Updated Student Details:", updatedStudentDetails);
            return NextResponse.json({
                message: "Student Details updated successfully",
                success: true,
                updatedStudentDetails
            });
        } else {
            // This block is now unlikely to be reached due to upsert: true
            return NextResponse.json(
                { error: "Failed to update or create student details" },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}