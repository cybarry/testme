// app/student/dashboard/page.tsx
import { StudentSidebar } from '@/components/student/sidebar';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Student Dashboard - CBT Platform'
};

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'student') redirect('/login');

  // Fetch real data using your existing APIs
  const [resultsRes, availableRes, progressRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/student/results`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/exam/available`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/student/progress`, { cache: 'no-store' })
  ]);

  const results = resultsRes.ok ? await resultsRes.json() : { results: [] };
  const available = availableRes.ok ? await availableRes.json() : { exams: [] };
  const progress = progressRes.ok ? await progressRes.json() : { progress: [] };

  // Real calculations
  const finished = (results.results || []).filter((r: any) => r.status === 'finished');
  const scores = finished.map((r: any) => r.normalizedScore || 0).filter(Boolean);
  const examsWritten = finished.length;
  const averageScore = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
  const highestScore = scores.length ? Math.max(...scores) : 0;
  const startedIds = new Set(progress.progress?.map((p: any) => p.examId.toString()) || []);
  const pendingExams = (available.exams || []).filter((e: any) => !startedIds.has(e._id.toString())).length;

  return (
    <div className="flex bg-background">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
            <p className="text-muted mt-2">Here is your exam summary</p>
          </div>

          {/* Real Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted text-sm">Exams Written</p>
              <p className="text-4xl font-bold text-foreground mt-2">{examsWritten}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted text-sm">Average Score</p>
              <p className="text-4xl font-bold text-foreground mt-2">{averageScore || '—'}<span className="text-2xl">/1000</span></p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted text-sm">Highest Score</p>
              <p className="text-4xl font-bold text-foreground mt-2">{highestScore || '—'}<span className="text-2xl">/1000</span></p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted text-sm">Pending Exams</p>
              <p className="text-4xl font-bold text-foreground mt-2">{pendingExams}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted">Select an exam from the menu to continue</p>
          </div>
        </div>
      </main>
    </div>
  );
}