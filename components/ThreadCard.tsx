'use client';

import type { Thread } from '../types/thread';
import { ThreadPatterns } from '../types/thread';

interface ThreadCardProps {
  thread: Thread;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const isDrifting = ThreadPatterns.isDrifting(thread);
  const isBlocked = ThreadPatterns.isBlocked(thread);
  const isActive = ThreadPatterns.isActive(thread);
  
  const statusColors = {
    active: 'border-green-300 bg-green-50',
    drifting: 'border-yellow-300 bg-yellow-50',
    blocked: 'border-red-300 bg-red-50',
    paused: 'border-gray-300 bg-gray-50',
    complete: 'border-blue-300 bg-blue-50'
  };
  
  const statusEmoji = {
    active: '🟢',
    drifting: '🟡',
    blocked: '🔴',
    paused: '⏸️',
    complete: '✅'
  };

  const momentum = ThreadPatterns.getMomentumScore(thread);
  const momentumColor = momentum > 80 ? 'bg-green-500' : momentum > 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`rounded-lg border-2 p-4 ${statusColors[thread.status]}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>{statusEmoji[thread.status]}</span>
              {thread.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-500" title="Momentum Score">
              <span>⚡ {momentum}</span>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${momentumColor}`} 
                  style={{ width: `${momentum}%` }}
                />
              </div>
            </div>
          </div>
          {thread.description && (
            <p className="text-sm text-gray-600 mt-1">{thread.description}</p>
          )}
        </div>
      </div>

      {/* Working On */}
      {thread.workingOn.task && (
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-500 mb-1">Working On</div>
          <div className="text-sm">{thread.workingOn.task}</div>
          
          {thread.workingOn.criticalPath && (
            <div className="text-xs text-gray-600 mt-1 italic">
              Critical: {thread.workingOn.criticalPath}
            </div>
          )}
        </div>
      )}

      {/* Bumps */}
      {thread.workingOn.bumps.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-medium text-red-600 mb-1">Bumps</div>
          <ul className="text-sm space-y-1">
            {thread.workingOn.bumps.map((bump, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500">⚠️</span>
                <span>{bump}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Todo */}
      {thread.todo.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-500 mb-1">Next Up</div>
          <ul className="text-sm space-y-1">
            {thread.todo.slice(0, 3).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Done */}
      {thread.done.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-medium text-green-600 mb-1">Done</div>
          <ul className="text-sm space-y-1">
            {thread.done.slice(-2).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>{item.task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
        Last touched: {new Date(thread.lastTouched).toLocaleDateString()}
      </div>
    </div>
  );
}
