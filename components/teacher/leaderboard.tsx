'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeaderboardEntry {
  _id: string;
  studentId: { username: string };
  normalizedScore: number;
  terminatedForCheating: boolean;
}

interface LeaderboardProps {
  examId: string;
}

export function Leaderboard({ examId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [examId]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/exam/${examId}/leaderboard`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted">Loading leaderboard...</div>;
  }

  if (leaderboard.length === 0) {
    return <div className="text-muted text-center p-8">No submissions yet</div>;
  }

  return (
    <Card className="border-border bg-muted-lighter/30">
      <CardHeader>
        <CardTitle className="text-foreground">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((entry, idx) => (
            <div
              key={entry._id}
              className="flex items-center justify-between p-4 rounded bg-input border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">#{idx + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{entry.studentId.username}</p>
                  {entry.terminatedForCheating && (
                    <p className="text-xs text-error">Terminated for cheating</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-foreground">{entry.normalizedScore}</p>
                <p className="text-xs text-muted">/1000</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
