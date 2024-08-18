// import { connect } from "@/database/mongo.config";
// import { User } from "@/models/User";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import { cookies } from "next/headers";
// import { verifyToken } from "@/utils/auth";

// connect();

// export async function POST(request: NextRequest) {
//   const cookieStore = cookies();
//   const token = cookieStore.get("token")?.value;
//   let userRole = null;
//   if (token) {
//     const decodedToken = verifyToken(token);
//     if (decodedToken && typeof decodedToken === "object") {
//       userRole = decodedToken.role;
//     }
//   }

//   if (userRole === "Admin") {
//     try {
//       const reqBody = await request.json();
//       const { username, name, email, password, role } = reqBody;
//       console.log(reqBody);
//       const user = await User.findOne({ email });
//       if (user) {
//         return NextResponse.json(
//           { error: "user already exists" },
//           { status: 400 }
//         );
//       }
//       const Roles = ["Admin", "FacultyStaff", "PlacementOfficer", "Student"];
//       if (!Roles.includes(role)) {
//         throw new Error(
//           "Unspecified Role!\nPlease choose role from the following:\n 1. Admin\n 2. FacultyStaff\n 3. PlacementOfficer\n 4. Student"
//         );
//       }
//       const salt = await bcryptjs.genSalt(10);
//       const hashedPassword = await bcryptjs.hash(password, salt);
//       const newUser = new User({
//         username,
//         name,
//         email,
//         password: hashedPassword,
//         role,
//       });
//       const savedUser = await newUser.save();
//       console.log(savedUser);

//       // send verification email
//       // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
//       return NextResponse.json({
//         message: "user registered successfully",
//         success: true,
//         savedUser,
//       });
//     } catch (error: any) {
//       console.log(error)
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//   } else {
//     NextResponse.json({ message: "Access Denied!" }, { status: 403 });
//   }
// }
import { connect } from "@/database/mongo.config";
import { User } from "@/models/User";
import { StudentDetails } from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
connect();
export async function POST(request: NextRequest) {
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
      const reqBody = await request.json();
      const { username, name, email, password, role } = reqBody;
      console.log(reqBody);
      const user = await User.findOne({ email });
      if (user) {
        return NextResponse.json(
          { error: "user already exists" },
          { status: 400 }
        );
      }
      const Roles = ["Admin", "Staff", "PO", "Student"];
      if (!Roles.includes(role)) 
        {
        throw new Error(
          "Unspecified Role!\nPlease choose role from the following:\n 1. Admin\n 2. Staff\n 3. PlacementOfficer\n 4. Student"
        );
      }
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      const newUser = new User({
        username,
        name,
        email,
        password: hashedPassword,
        role,
      });
      const savedUser = await newUser.save();
      console.log(savedUser);
      if (role === "Student") {
        const studentDetails = new StudentDetails({
          student_id: savedUser._id,
          email: savedUser.email,
          username: savedUser.username,
          name: savedUser.name,

        });
        
        await studentDetails.save();
        console.log(studentDetails);
      }
      // send verification email
      // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
      return NextResponse.json({
        message: "user registered successfully",
        success: true,
        savedUser,
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }
}

