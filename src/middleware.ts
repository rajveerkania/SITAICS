import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the roles and their accessible routes
type UserRole = 'Admin' | 'Student' | 'PO' | 'Staff';

const protectedRoutes: Record<UserRole, string[]> = {
    Admin: ['/admin/dashboard'],
    Student: ['/student/dashboard'],
    PO: ['/po/dashboard'],
    Staff: ['/staff/dashboard'],
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value || '';

    console.log(`Accessing path: ${pathname}`);
    console.log(`Token: ${token}`);

    // Define protected paths
    const protectedPaths = Object.values(protectedRoutes).flat();
    const isPublicPath = pathname === '/';
    const isProtectedPath = protectedPaths.includes(pathname);

    // If the user is authenticated and trying to access a public path
    if (isPublicPath && token) {
        try {
            // Decode the token to get the user's role
            const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            const userRole = user.role as UserRole; // Explicitly assert the type

            // Ensure the role is valid and get the corresponding dashboard path
            if (protectedRoutes[userRole]) {
                const dashboardPath = protectedRoutes[userRole]?.[0] || '/';
                return NextResponse.redirect(new URL(dashboardPath, request.url));
            } else {
                console.error('Invalid user role:', userRole);
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            console.error('Error parsing token:', error);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Redirect unauthenticated users from protected routes to the public route
    if (isProtectedPath && !token) {
        console.log('No token found for protected route. Redirecting to public route.');
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if the user is authenticated and trying to access a protected route
    if (isProtectedPath && token) {
        try {
            // Decode the token to get the user's role
            const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            const userRole = user.role as UserRole;

            // Check if the user's role has access to the requested path
            if (!Object.values(protectedRoutes[userRole] || []).includes(pathname)) {
                console.log(`Unauthorized access attempt. User role: ${userRole}, Attempted route: ${pathname}`);
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            console.error('Error parsing token:', error);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Allow the request if none of the above conditions are met
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/admin/dashboard',
        '/student/dashboard',
        '/po/dashboard',
        '/staff/dashboard',
    ]
};
    