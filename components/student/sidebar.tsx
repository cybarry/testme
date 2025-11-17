'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/zustand-store';

export function StudentSidebar() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-muted-lighter/50 border-r border-border min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground">CBT Student</h1>
        <p className="text-sm text-muted">Portal</p>
      </div>

      <nav className="flex-1 space-y-2">
        <a
          href="/student/dashboard"
          className="block px-4 py-2 rounded-md text-foreground hover:bg-primary/10 transition"
        >
          Dashboard
        </a>
        <a
          href="/student/exams"
          className="block px-4 py-2 rounded-md text-foreground hover:bg-primary/10 transition"
        >
          Available Exams
        </a>
        <a
          href="/student/results"
          className="block px-4 py-2 rounded-md text-foreground hover:bg-primary/10 transition"
        >
          My Results
        </a>
      </nav>

      <Button
        onClick={handleLogout}
        variant="destructive"
        className="w-full bg-error hover:bg-error/90"
      >
        Logout
      </Button>
    </aside>
  );
}
