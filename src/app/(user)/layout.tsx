'use client';
// Your role constants
import { useAuth } from '@/hooks/useAuth'; // Import your auth hook
import UserLayout from '@/templates/user/UserLayout'; // Import your user layout
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading } = useAuth(); // Your auth hook
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;

  // Protect user routes with auth check
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state or render layout with children
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return user ? <UserLayout>{children}</UserLayout> : null;
}
