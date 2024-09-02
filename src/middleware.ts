import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "Admin" | "Student" | "PO" | "Staff";

const protectedRoutes: Record<UserRole, string[]> = {
  Admin: ["/admin/dashboard"],
  Student: ["/student/dashboard"],
  PO: ["/po/dashboard"],
  Staff: ["/staff/dashboard"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || "";

  console.log(`Accessing path: ${pathname}`);

  const protectedPaths = Object.values(protectedRoutes).flat();
  const isPublicPath = pathname === "/";
  const isProtectedPath = protectedPaths.includes(pathname);

  if (isPublicPath && token) {
    try {
      const user = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const userRole = user.role as UserRole;

      if (protectedRoutes[userRole]) {
        const dashboardPath = protectedRoutes[userRole]?.[0] || "/";
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      } else {
        console.error("Invalid user role:", userRole);
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isProtectedPath && !token) {
    console.log(
      "No token found for protected route. Redirecting to public route."
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedPath && token) {
    try {
      const user = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const userRole = user.role as UserRole;

      if (!Object.values(protectedRoutes[userRole] || []).includes(pathname)) {
        console.log(
          `Unauthorized access attempt. User role: ${userRole}, Attempted route: ${pathname}`
        );
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/dashboard",
    "/student/dashboard",
    "/po/dashboard",
    "/staff/dashboard",
  ],
};
