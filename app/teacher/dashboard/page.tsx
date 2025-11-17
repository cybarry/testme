import { TeacherSidebar } from '@/components/teacher/sidebar';

export const metadata = {
  title: 'Teacher Dashboard - CBT Platform'
};

export default function TeacherDashboard() {
  return (
    <div className="flex bg-background">
      <TeacherSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome</h2>
            <p className="text-muted mt-2">Manage your question banks and exams</p>
          </div>
        </div>
      </main>
    </div>
  );
}
