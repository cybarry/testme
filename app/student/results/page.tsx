import { ResultsHistory } from '@/components/student/results-history';
import { StudentSidebar } from '@/components/student/sidebar';

export const metadata = {
  title: 'My Results - CBT Platform'
};

export default function ResultsPage() {
  return (
    <div className="flex bg-background">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Results</h2>
            <p className="text-muted mt-2">View all your exam submissions</p>
          </div>
          <ResultsHistory />
        </div>
      </main>
    </div>
  );
}
