import { UserManagement } from '@/components/admin/user-management';
import { AdminSidebar } from '@/components/admin/sidebar';

export const metadata = {
  title: 'User Management - CBT Platform'
};

export default function AdminUsersPage() {
  return (
    <div className="flex bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">User Management</h2>
            <p className="text-muted mt-2">Create and manage users</p>
          </div>
          <UserManagement />
        </div>
      </main>
    </div>
  );
}
