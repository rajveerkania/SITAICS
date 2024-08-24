import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin Dashboard",
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

  if (!decodedToken || typeof decodedToken !== "object" || decodedToken.role !== "Admin") {
    return <p>Access Denied</p>;
  }

  return <>{children}</>;
}
