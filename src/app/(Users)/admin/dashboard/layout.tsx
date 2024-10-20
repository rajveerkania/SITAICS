"use client"

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/dashboard') {
      sessionStorage.removeItem('routeHistory');
    }
  }, [pathname]);

  return <>{children}</>;
}