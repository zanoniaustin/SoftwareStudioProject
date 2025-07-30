// src/components/auth/AuthGuard.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks';
import { User } from '../../types';

interface AuthGuardProps {
  children: (user: User) => React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // You can replace this with a nice skeleton loader
    return (
      <div className="flex justify-center items-center h-64">
        Loading user data...
      </div>
    );
  }

  return <>{children(user)}</>;
}
