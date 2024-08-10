import { connect } from "@/database/mongo.config";
import { User } from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  let userRole = null;
  if (token) {
    const decodedToken = verifyToken(token);
    if (decodedToken && typeof decodedToken === "object") {
      userRole = decodedToken.role;
    }
  }

  if (userRole === "Admin") {
    try {
      const users = await User.find({ isActive: true }).select("-password");

      if (!users.length) {
        return NextResponse.json(
          { message: "No users found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        users,
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Access Denied" }, { status: 403 });
  }
}
