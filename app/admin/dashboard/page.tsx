import { DashboardStats } from '@/components/admin/dashboard-stats';
import { AdminSidebar } from '@/components/admin/sidebar';

export const metadata = {
  title: 'Admin Dashboard - CBT Platform'
};

export default function AdminDashboard() {
  return (
    <div className="flex bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted mt-2">Welcome to the admin control panel</p>
          </div>
          <DashboardStats />
        </div>
      </main>
    </div>
  );
}
