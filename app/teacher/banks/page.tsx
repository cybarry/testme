import { QuestionBankManagement } from '@/components/teacher/question-bank-management';
import { TeacherSidebar } from '@/components/teacher/sidebar';

export const metadata = {
  title: 'Question Banks - CBT Platform'
};

export default function TeacherBanksPage() {
  return (
    <div className="flex bg-background">
      <TeacherSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Question Banks</h2>
            <p className="text-muted mt-2">Create and manage question banks</p>
          </div>
          <QuestionBankManagement />
        </div>
      </main>
    </div>
  );
}
