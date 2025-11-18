import { AdminSidebar } from '@/components/admin/sidebar';
import { ExamManagement } from '@/components/teacher/exam-management';
import { TeacherSidebar } from '@/components/teacher/sidebar';

export const metadata = {
  title: 'Exams - CBT Platform'
};

export default function TeacherExamsPage() {
  return (
    <div className="flex bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Exams</h2>
            <p className="text-muted mt-2">Create and manage exams</p>
          </div>
          <ExamManagement />
        </div>
      </main>
    </div>
  );
}
