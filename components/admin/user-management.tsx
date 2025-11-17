'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('student');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const query = selectedRole ? `?role=${selectedRole}` : '';
      const response = await fetch(`/api/admin/users${query}`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole
        })
      });

      if (response.ok) {
        setNewUsername('');
        setNewPassword('');
        setNewRole('student');
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-muted-lighter/30">
        <CardHeader>
          <CardTitle className="text-foreground">Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="bg-input border-border text-foreground"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-input border-border text-foreground"
                required
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="rounded-md border border-border bg-input px-3 py-2 text-foreground"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
              Create User
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-muted-lighter/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Users</CardTitle>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-muted">No users found</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-md bg-input border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{user.username}</p>
                    <p className="text-sm text-muted capitalize">{user.role}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-error hover:bg-error/90"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
