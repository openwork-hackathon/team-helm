'use client';

import { useState, useEffect } from 'react';
import type { Thread } from '../types/thread';
import { ThreadPatterns } from '../types/thread';

interface SessionManagerProps {
  threads: Thread[];
  onThreadSelect: (thread: Thread) => void;
  activeThreadId?: string;
}

type ViewMode = 'grid' | 'list' | 'kanban';
type FilterStatus = 'all' | 'active' | 'drifting' | 'blocked' | 'attention';

export function SessionManager({ threads, onThreadSelect, activeThreadId }: SessionManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  // Categorize threads
  const categorized = threads.reduce((acc, thread) => {
    const isDrifting = ThreadPatterns.isDrifting(thread);
    const isBlocked = ThreadPatterns.isBlocked(thread);
    const needsAttention = ThreadPatterns.needsAttention(thread);

    if (isBlocked) acc.blocked.push(thread);
    else if (isDrifting) acc.drifting.push(thread);
    else if (needsAttention) acc.attention.push(thread);
    else acc.active.push(thread);

    return acc;
  }, {
    active: [] as Thread[],
    attention: [] as Thread[],
    drifting: [] as Thread[],
    blocked: [] as Thread[]
  });

  // Filter threads
  const filterThreads = (threadList: Thread[]) => {
    return threadList.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const getFilteredList = (list: Thread[]) => {
    if (filter === 'all') return filterThreads(list);
    if (filter === 'attention') return filterThreads([...categorized.attention, ...categorized.blocked, ...categorized.drifting]);
    return filterThreads(list);
  };

  const stats = {
    total: threads.length,
    active: categorized.active.length,
    attention: categorized.attention.length,
    drifting: categorized.drifting.length,
    blocked: categorized.blocked.length
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-5 gap-2 text-center">
        <StatCard label="Total" value={stats.total} color="gray" />
        <StatCard label="Active" value={stats.active} color="green" />
        <StatCard label="Attention" value={stats.attention} color="yellow" />
        <StatCard label="Drifting" value={stats.drifting} color="orange" />
        <StatCard label="Blocked" value={stats.blocked} color="red" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-3 rounded-lg border border-gray-200">
        {/* Search */}
        <input
          type="text"
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm flex-1 min-w-[200px]"
        />

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterStatus)}
          className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Sessions</option>
          <option value="active">Active Only</option>
          <option value="attention">Needs Attention</option>
          <option value="drifting">Drifting</option>
          <option value="blocked">Blocked</option>
        </select>

        {/* View Mode */}
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 text-sm ${viewMode === 'kanban' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Kanban
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-sm ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Views */}
      {viewMode === 'kanban' && (
        <KanbanView 
          categorized={categorized}
          getFilteredList={getFilteredList}
          onThreadSelect={onThreadSelect}
          activeThreadId={activeThreadId}
        />
      )}

      {viewMode === 'grid' && (
        <GridView 
          threads={getFilteredList(threads)}
          onThreadSelect={onThreadSelect}
          activeThreadId={activeThreadId}
        />
      )}

      {viewMode === 'list' && (
        <ListView 
          threads={getFilteredList(threads)}
          onThreadSelect={onThreadSelect}
          activeThreadId={activeThreadId}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-50 border-gray-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200'
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

function KanbanView({ 
  categorized, 
  getFilteredList,
  onThreadSelect,
  activeThreadId 
}: { 
  categorized: any;
  getFilteredList: (list: Thread[]) => Thread[];
  onThreadSelect: (thread: Thread) => void;
  activeThreadId?: string;
}) {
  const columns = [
    { key: 'active', title: 'Active 🟢', color: 'border-green-300', bg: 'bg-green-50' },
    { key: 'attention', title: 'Attention 🟡', color: 'border-yellow-300', bg: 'bg-yellow-50' },
    { key: 'drifting', title: 'Drifting 🟠', color: 'border-orange-300', bg: 'bg-orange-50' },
    { key: 'blocked', title: 'Blocked 🔴', color: 'border-red-300', bg: 'bg-red-50' }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 overflow-x-auto">
      {columns.map(col => (
        <div key={col.key} className={`${col.bg} rounded-lg border-2 ${col.color} min-h-[300px]`}>
          <div className="p-3 font-semibold border-b border-gray-200">
            {col.title}
            <span className="ml-2 text-sm text-gray-500">
              ({getFilteredList(categorized[col.key]).length})
            </span>
          </div>
          <div className="p-2 space-y-2">
            {getFilteredList(categorized[col.key]).map(thread => (
              <KanbanCard 
                key={thread.id} 
                thread={thread} 
                onClick={() => onThreadSelect(thread)}
                isActive={thread.id === activeThreadId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function KanbanCard({ thread, onClick, isActive }: { thread: Thread; onClick: () => void; isActive?: boolean }) {
  const daysSince = Math.floor(
    (Date.now() - new Date(thread.lastTouched).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div 
      onClick={onClick}
      className={`p-3 bg-white rounded border cursor-pointer hover:shadow-md transition-shadow ${
        isActive ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="font-medium text-sm mb-1">{thread.name}</div>
      {thread.workingOn.task && (
        <div className="text-xs text-gray-600 mb-2 line-clamp-2">
          {thread.workingOn.task}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince}d ago`}</span>
        {thread.workingOn.bumps.length > 0 && (
          <span className="text-red-500">⚠️ {thread.workingOn.bumps.length}</span>
        )}
      </div>
    </div>
  );
}

function GridView({ threads, onThreadSelect, activeThreadId }: { 
  threads: Thread[]; 
  onThreadSelect: (thread: Thread) => void;
  activeThreadId?: string;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {threads.map(thread => (
        <div 
          key={thread.id}
          onClick={() => onThreadSelect(thread)}
          className={`p-4 bg-white rounded-lg border cursor-pointer hover:shadow-lg transition-shadow ${
            activeThreadId === thread.id ? 'ring-2 ring-blue-400' : ''
          }`}
        >
          <StatusBadge thread={thread} />
          <div className="font-semibold mt-2">{thread.name}</div>
          <div className="text-sm text-gray-600 mt-1 line-clamp-2">{thread.description}</div>
          <div className="mt-3 text-xs text-gray-500">
            {thread.workingOn.task && (
              <div className="truncate">→ {thread.workingOn.task}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListView({ threads, onThreadSelect, activeThreadId }: { 
  threads: Thread[]; 
  onThreadSelect: (thread: Thread) => void;
  activeThreadId?: string;
}) {
  return (
    <div className="space-y-2">
      {threads.map(thread => (
        <div 
          key={thread.id}
          onClick={() => onThreadSelect(thread)}
          className={`p-3 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4 ${
            activeThreadId === thread.id ? 'ring-2 ring-blue-400' : ''
          }`}
        >
          <StatusBadge thread={thread} />
          <div className="flex-1">
            <div className="font-medium">{thread.name}</div>
            <div className="text-sm text-gray-600">{thread.workingOn.task || 'No current task'}</div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>{new Date(thread.lastTouched).toLocaleDateString()}</div>
            {thread.workingOn.bumps.length > 0 && (
              <div className="text-red-500">{thread.workingOn.bumps.length} blockers</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ thread }: { thread: Thread }) {
  const isDrifting = ThreadPatterns.isDrifting(thread);
  const isBlocked = ThreadPatterns.isBlocked(thread);
  
  if (isBlocked) return <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">🔴 Blocked</span>;
  if (isDrifting) return <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">🟠 Drifting</span>;
  if (thread.workingOn.bumps.length > 0) return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">🟡 Attention</span>;
  return <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">🟢 Active</span>;
}
