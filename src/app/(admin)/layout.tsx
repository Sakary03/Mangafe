'use client';
import { UserRole } from '@/constants/UserRole';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/templates/admin/AdminLayout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading } = useAuth();
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // This useEffect will only run on the client side
  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;

    setUser(storedUser);
    console.log('Checking user role in admin layout:', storedUser);
  }, []);

  // Protect admin routes with role check
  useEffect(() => {
    if (!loading && isClient) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/sign-in');
      } else if (user.role !== UserRole.ADMIN) {
        // Redirect to user dashboard if not admin
        router.push('/');
      }
    }
  }, [user, loading, router, isClient]);

  // Show loading state while we're determining auth status
  if (loading || !isClient) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return user && user.role === UserRole.ADMIN ? <AdminLayout>{children}</AdminLayout> : null;
}
