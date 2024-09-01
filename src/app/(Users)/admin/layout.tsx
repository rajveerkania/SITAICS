import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
import type { Metadata } from "next";
import AccessDenied from "@/components/accessDenied";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = verifyToken();

  if (!userRole?.role || userRole?.role !== "Admin") {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
