import { connect } from "@/database/mongo.config";
import { NextRequest, NextResponse } from "next/server"

connect()
export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json({
            message: "Logout Sucessfull",
            success: true
        })
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)

        },)
        return response
    }
    catch (error: any) {
        return NextResponse.json({ error }, { status: 500 })
    }
}