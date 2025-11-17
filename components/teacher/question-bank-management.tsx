'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionBank {
  _id: string;
  name: string;
  description: string;
  questionCount: number;
  createdAt: string;
}

export function QuestionBankManagement() {
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBankName, setNewBankName] = useState('');
  const [newBankDesc, setNewBankDesc] = useState('');
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/teacher/banks');
      const data = await response.json();
      setBanks(data.banks || []);
    } catch (error) {
      console.error('Failed to fetch banks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/teacher/banks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBankName, description: newBankDesc })
      });

      if (response.ok) {
        setNewBankName('');
        setNewBankDesc('');
        fetchBanks();
      }
    } catch (error) {
      console.error('Failed to create bank:', error);
    }
  };

  const handleUploadQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBankId || !uploadFile) return;

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const response = await fetch(`/api/teacher/banks/${selectedBankId}/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setUploadFile(null);
        setSelectedBankId(null);
        fetchBanks();
      }
    } catch (error) {
      console.error('Failed to upload questions:', error);
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    if (confirm('Delete this question bank?')) {
      try {
        const response = await fetch(`/api/teacher/banks/${bankId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchBanks();
        }
      } catch (error) {
        console.error('Failed to delete bank:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-muted-lighter/30">
        <CardHeader>
          <CardTitle className="text-foreground">Create Question Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBank} className="space-y-4">
            <Input
              placeholder="Bank name"
              value={newBankName}
              onChange={(e) => setNewBankName(e.target.value)}
              className="bg-input border-border text-foreground"
              required
            />
            <Input
              placeholder="Description (optional)"
              value={newBankDesc}
              onChange={(e) => setNewBankDesc(e.target.value)}
              className="bg-input border-border text-foreground"
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
              Create Bank
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-muted-lighter/30">
        <CardHeader>
          <CardTitle className="text-foreground">Upload Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadQuestions} className="space-y-4">
            <select
              value={selectedBankId || ''}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground"
              required
            >
              <option value="">Select a question bank</option>
              {banks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.name}
                </option>
              ))}
            </select>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer text-primary hover:text-primary-dark"
              >
                Click to upload JSON file
              </label>
              {uploadFile && <p className="text-sm text-muted mt-2">{uploadFile.name}</p>}
            </div>

            <Button
              type="submit"
              disabled={!selectedBankId || !uploadFile}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              Upload Questions
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-muted-lighter/30">
        <CardHeader>
          <CardTitle className="text-foreground">Question Banks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted">Loading banks...</p>
          ) : banks.length === 0 ? (
            <p className="text-muted">No question banks created</p>
          ) : (
            <div className="space-y-3">
              {banks.map((bank) => (
                <div
                  key={bank._id}
                  className="flex items-center justify-between p-4 rounded-md bg-input border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{bank.name}</p>
                    <p className="text-sm text-muted">{bank.questionCount} questions</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBank(bank._id)}
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
