import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
import type { Metadata } from "next";
import AccessDenied from "@/components/accessDenied";

export const metadata: Metadata = {
  title: "Staff Dashboard",
  description: "Staff Dashboard",
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
    decodedToken.role !== "Staff"
  ) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
