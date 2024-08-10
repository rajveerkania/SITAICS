import { connect } from "@/database/mongo.config";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const users = await User.find({ isActive: true }).select("-password");

    if (!users.length) {
      return NextResponse.json({ message: "No users found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}