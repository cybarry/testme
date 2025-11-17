import { StudentSidebar } from '@/components/student/sidebar';

export const metadata = {
  title: 'Student Dashboard - CBT Platform'
};

export default function StudentDashboard() {
  return (
    <div className="flex bg-background">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome to CBT Platform</h2>
            <p className="text-muted mt-2">Select an exam to begin testing</p>
          </div>
        </div>
      </main>
    </div>
  );
}
