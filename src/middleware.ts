import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface CustomUser {
  role?: "Admin" | "PlacementOfficer" | "Staff" | "Student";
}

type ProtectedRoutes = {
  [K in NonNullable<CustomUser["role"]>]: string[];
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`Accessing path: ${pathname}`);

  const publicRoutes = ["/"];
  const protectedRoutes: ProtectedRoutes = {
    Admin: ["/admin"],
    PlacementOfficer: ["/po"],
    Staff: ["/staff"],
    Student: ["/student"],
  };

  const allProtectedRoutes = Object.values(protectedRoutes).flat();

  try {
    const token = request.cookies.get("token")?.value;
    console.log(`Token received: ${token ? "Yes" : "No"}`);

    if (
      !token &&
      allProtectedRoutes.some((route) => pathname.startsWith(route))
    ) {
      console.log("No token found for protected route. Redirecting to home.");
      return NextResponse.redirect(
        new URL(`/?error=unauthorized`, request.url)
      );
    }

    if (token) {
      const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      const user = payload as CustomUser;
      console.log(`User role: ${user.role || "undefined"}`);

      if (!user || !user.role) {
        console.error("User or role is undefined in the token");
        return NextResponse.redirect(
          new URL(`/?error=invalid_user_data`, request.url)
        );
      }

      if (publicRoutes.includes(pathname)) {
        const dashboardPath =
          protectedRoutes[user.role]?.[0] + "/dashboard" || "/";
        console.log(
          `Redirecting authenticated user from public route to: ${dashboardPath}`
        );
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }

      if (allProtectedRoutes.some((route) => pathname.startsWith(route))) {
        const isAuthorized = protectedRoutes[user.role]?.some((route) =>
          pathname.startsWith(route)
        );

        if (!isAuthorized) {
          console.log(
            `Unauthorized access attempt. User role: ${user.role}, Attempted route: ${pathname}`
          );
          return NextResponse.redirect(
            new URL(`/?error=unauthorized`, request.url)
          );
        }
      }
    }

    console.log("Access granted");
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL(`/404`, request.url));
  }
}

export const config = {
  matcher: [
    "/", // Public route
    "/admin/:path*", // Admin protected routes
    "/po/:path*", // PO protected routes
    "/staff/:path*", // Staff protected routes
    "/student/:path*", // Student protected routes
  ],
};
