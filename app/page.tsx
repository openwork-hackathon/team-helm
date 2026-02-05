'use client';

import { useEffect, useState } from 'react';
import { ThreadCard } from '@/components/ThreadCard';
import type { Thread } from '@/types/thread';

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/threads')
      .then(res => res.json())
      .then(data => {
        setThreads(data.threads);
        setLoading(false);
      });
  }, []);

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
                <span className="text-xs text-green-600 font-medium">Building</span>
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

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 space-y-2">
          <p>Built during the Openwork Clawathon 🦞</p>
          <p className="italic">Using GMCLAW heartbeat format for continuity tracking</p>
        </div>
      </div>
    </main>
  );
}
