'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import { Home } from 'lucide-react';

type BreadcrumbItem = {
  title: ReactNode;
  link: string;
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];

    const segments = pathname.split('/').filter(Boolean);

    const homeBreadcrumb: BreadcrumbItem = {
      title: <Home className="w-5 h-5 mr-2" />, 
      link: '/' 
    };

    const dynamicBreadcrumbs = segments.map((segment, index) => {
      if (segment === 'dashboard') {
        return null; 
      }
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    }).filter(Boolean);

    return [homeBreadcrumb, ...dynamicBreadcrumbs];
  }, [pathname]);

  return breadcrumbs;
}
