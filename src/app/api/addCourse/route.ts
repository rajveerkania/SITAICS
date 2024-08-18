import { connect } from "@/database/mongo.config";
import { Course } from "@/models/Course";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { courseName, courseDuration } = reqBody;
        console.log(reqBody);
        const course = await Course.findOne({ courseName })
        if (course) 
        {
            return NextResponse.json(
                { error: "course already exists" },
                { status: 400 }
            );
        }
        const addCourse = new Course({
            courseName,
            courseDuration
        });
        const savedCourse = await addCourse.save();
        console.log(savedCourse);


        return NextResponse.json({
            message: "Course added successfully",
            success: true,
            savedCourse,
        });
    } 
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }

}