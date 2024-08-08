import { connect } from "@/database/mongo.config";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function PUT(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: "Request error!" }, { status: 400 });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Username not found" },
        { status: 404 }
      );
    }
    await User.updateOne(
      { username },
      { $set: { isActive: false } },
      { new: true }
    );
    return NextResponse.json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}