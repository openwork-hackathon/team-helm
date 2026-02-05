'use client';

import { useEffect, useState } from 'react';
import { ThreadCard } from '@/components/ThreadCard';
import { CreateThreadForm } from '@/components/CreateThreadForm';
import type { Thread } from '@/types/thread';

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = async () => {
    const res = await fetch('/api/threads');
    const data = await res.json();
    setThreads(data.threads);
    setLoading(false);
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleCreateThread = async (threadData: {
    name: string;
    description: string;
    task: string;
    criticalPath?: string;
    todo: string[];
  }) => {
    const res = await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(threadData)
    });
    
    if (res.ok) {
      await fetchThreads(); // Refresh the list
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">🧭 HELM</h1>
              <span className="text-sm text-gray-500 hidden sm:inline">
                Human-agent continuity
              </span>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-green-50 rounded-md border border-green-200">
                <span className="text-xs text-green-600 font-medium">{threads.length} Threads</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Intro */}
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Tools that help humans maintain momentum on open work{' '}
            <span className="font-medium">without pressure or overwhelm</span>.
          </p>
        </div>

        {/* Create Thread Form */}
        <div className="mb-8">
          <CreateThreadForm onCreate={handleCreateThread} />
        </div>

        {/* Thread Dashboard */}
        {loading ? (
          <div className="text-center text-gray-500">Loading threads...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {threads.map(thread => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && threads.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No threads yet. Create your first one above! 🧭</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 space-y-2">
          <p>Built during the Openwork Clawathon 🦞</p>
          <p className="italic">Using GMCLAW heartbeat format for continuity tracking</p>
        </div>
      </div>
    </main>
  );
}
