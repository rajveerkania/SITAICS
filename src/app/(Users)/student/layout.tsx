import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
import type { Metadata } from "next";
import AccessDenied from "@/components/accessDenied";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Student Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <p>Access Denied</p>;
  }

  const decodedToken = verifyToken(token);

  if (
    !decodedToken ||
    typeof decodedToken !== "object" ||
    decodedToken.role !== "Student"
  ) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
