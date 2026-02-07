'use client';

import { useEffect, useState } from 'react';
import { SessionManager } from '../components/SessionManager';
import { ThreadCard } from '../components/ThreadCard';
import { CreateThreadForm } from '../components/CreateThreadForm';
import { ThreadActions } from '../components/ThreadActions';
import { ConnectWallet } from '../components/ConnectWallet';
import type { Thread } from '../types/thread';

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  const fetchThreads = async () => {
    const res = await fetch('/api/threads');
    const data = await res.json();
    setThreads(data.threads);
    setLoading(false);
  };

  useEffect(() => {
    fetchThreads();
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchThreads, 30000);
    return () => clearInterval(interval);
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
      await fetchThreads();
    }
  };

  const handleUpdateThread = async (updatedThread: Thread) => {
    // Optimistic update
    setThreads(threads.map(t => t.id === updatedThread.id ? updatedThread : t));
    if (selectedThread?.id === updatedThread.id) {
      setSelectedThread(updatedThread);
    }

    try {
      const res = await fetch('/api/threads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedThread)
      });
      
      if (!res.ok) {
        throw new Error('Failed to update thread');
      }
    } catch (error) {
      console.error('Error updating thread:', error);
      // Revert on failure (optional, but good practice)
      fetchThreads();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">🧭 HELM</h1>
              <span className="text-sm text-gray-500 hidden sm:inline">
                Real-Time Session Manager
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <a href="/staking" className="text-sm font-medium text-gray-600 hover:text-blue-600 mr-2">
                Staking
              </a>
              <ConnectWallet />
              <div className="px-3 py-1 bg-blue-50 rounded-md border border-blue-200">
                <span className="text-xs text-blue-600 font-medium">{threads.length} Sessions</span>
              </div>
              <div className="px-3 py-1 bg-green-50 rounded-md border border-green-200">
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading sessions...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Session Manager - Left Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Session Manager</h2>
                  <div className="text-xs text-gray-500">
                    Updates every 30s
                  </div>
                </div>
                
                <SessionManager 
                  threads={threads}
                  onThreadSelect={setSelectedThread}
                  activeThreadId={selectedThread?.id}
                />
              </div>

              <CreateThreadForm onCreate={handleCreateThread} />
            </div>

            {/* Selected Thread Detail - Right Panel */}
            <div className="lg:col-span-1">
              {selectedThread ? (
                <div className="sticky top-24 space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Active Session</h3>
                      <button
                        onClick={() => setSelectedThread(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    
                    <ThreadCard thread={selectedThread} />
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <ThreadActions 
                        thread={selectedThread}
                        onUpdate={handleUpdateThread}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sticky top-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">👆</div>
                  <p>Select a session to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 space-y-2">
          <p>Built during the Openwork Clawathon 🦞</p>
          <p className="italic">Real-time continuity tracking for human-agent collaboration</p>
        </div>
      </div>
    </main>
  );
}
