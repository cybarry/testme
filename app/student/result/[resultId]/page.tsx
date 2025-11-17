import { ResultView } from '@/components/student/result-view';
import { StudentSidebar } from '@/components/student/sidebar';

export const metadata = {
  title: 'Exam Result - CBT Platform'
};

export default function ResultPage({ params }: { params: { resultId: string } }) {
  return (
    <div className="flex bg-background">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Exam Result</h2>
            <p className="text-muted mt-2">Review your performance</p>
          </div>
          <ResultView resultId={params.resultId} />
        </div>
      </main>
    </div>
  );
}
