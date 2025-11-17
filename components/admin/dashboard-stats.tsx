'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalExams: number;
  totalSubmissions: number;
  averageScore: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted">Loading stats...</div>;
  }

  if (!stats) {
    return <div className="text-error">Failed to load statistics</div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-primary/10' },
    { label: 'Students', value: stats.totalStudents, color: 'bg-secondary/10' },
    { label: 'Teachers', value: stats.totalTeachers, color: 'bg-success/10' },
    { label: 'Exams', value: stats.totalExams, color: 'bg-warning/10' },
    { label: 'Submissions', value: stats.totalSubmissions, color: 'bg-info/10' },
    { label: 'Avg Score', value: Math.round(stats.averageScore), color: 'bg-accent/10' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((card) => (
        <Card key={card.label} className={`border-border ${card.color}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">{card.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
