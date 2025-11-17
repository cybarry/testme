import { AvailableExams } from '@/components/student/available-exams';
import { StudentSidebar } from '@/components/student/sidebar';

export const metadata = {
  title: 'Available Exams - CBT Platform'
};

export default function StudentExamsPage() {
  return (
    <div className="flex bg-background">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Available Exams</h2>
            <p className="text-muted mt-2">Choose an exam to begin</p>
          </div>
          <AvailableExams />
        </div>
      </main>
    </div>
  );
}
