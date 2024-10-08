import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const usePreviousRoute = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get existing history from sessionStorage
    const routeHistory = JSON.parse(sessionStorage.getItem('routeHistory') || '[]');
    
    // Only add route if it's different from the last one
    if (routeHistory[routeHistory.length - 1] !== pathname) {
      // Keep only the last 10 routes to prevent excessive storage
      const updatedHistory = [...routeHistory, pathname].slice(-10);
      sessionStorage.setItem('routeHistory', JSON.stringify(updatedHistory));
    }
  }, [pathname]);

  const handleBack = () => {
    const routeHistory = JSON.parse(sessionStorage.getItem('routeHistory') || '[]');
    
    // Remove current route
    if (routeHistory[routeHistory.length - 1] === pathname) {
      routeHistory.pop();
    }

    // Get previous route
    const previousRoute = routeHistory[routeHistory.length - 1];

    if (!previousRoute || routeHistory.length === 0) {
      router.push('/admin/dashboard');
      return;
    }

    // Update history by removing the current route
    sessionStorage.setItem('routeHistory', JSON.stringify(routeHistory));
    
    // Navigate to previous route
    router.push(previousRoute);
  };

  return { handleBack };
};

export default usePreviousRoute;