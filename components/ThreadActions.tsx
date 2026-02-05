'use client';

import { useState } from 'react';
import type { Thread } from '../types/thread';

interface ThreadActionsProps {
  thread: Thread;
  onUpdate: (updatedThread: Thread) => void;
}

export function ThreadActions({ thread, onUpdate }: ThreadActionsProps) {
  const [showBumpForm, setShowBumpForm] = useState(false);
  const [showDoneForm, setShowDoneForm] = useState(false);
  const [bumpText, setBumpText] = useState('');
  const [doneText, setDoneText] = useState('');
  const [doneTest, setDoneTest] = useState('');

  const handleAddBump = async () => {
    if (!bumpText.trim()) return;
    
    const updatedThread = {
      ...thread,
      workingOn: {
        ...thread.workingOn,
        bumps: [...thread.workingOn.bumps, bumpText.trim()]
      },
      lastTouched: new Date().toISOString()
    };
    
    onUpdate(updatedThread);
    setBumpText('');
    setShowBumpForm(false);
  };

  const handleMarkDone = async () => {
    if (!doneText.trim()) return;
    
    const updatedThread = {
      ...thread,
      done: [
        ...thread.done,
        { task: doneText.trim(), test: doneTest.trim() || undefined }
      ],
      lastTouched: new Date().toISOString()
    };
    
    onUpdate(updatedThread);
    setDoneText('');
    setDoneTest('');
    setShowDoneForm(false);
  };

  const handleRemoveBump = async (index: number) => {
    const updatedThread = {
      ...thread,
      workingOn: {
        ...thread.workingOn,
        bumps: thread.workingOn.bumps.filter((_, i) => i !== index)
      },
      lastTouched: new Date().toISOString()
    };
    
    onUpdate(updatedThread);
  };

  const handleTouch = async () => {
    const updatedThread = {
      ...thread,
      lastTouched: new Date().toISOString()
    };
    
    onUpdate(updatedThread);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-gray-200">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowBumpForm(!showBumpForm)}
          className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100"
        >
          ⚠️ Add Bump
        </button>
        
        <button
          onClick={() => setShowDoneForm(!showDoneForm)}
          className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100"
        >
          ✓ Mark Done
        </button>
        
        <button
          onClick={handleTouch}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
        >
          👋 Touch
        </button>
      </div>

      {/* Add Bump Form */}
      {showBumpForm && (
        <div className="bg-red-50 p-3 rounded-md space-y-2">
          <div className="text-sm font-medium text-red-800">What's blocking you?</div>
          <input
            type="text"
            value={bumpText}
            onChange={(e) => setBumpText(e.target.value)}
            placeholder="Describe the blocker..."
            className="w-full px-3 py-2 border border-red-200 rounded-md text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddBump()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddBump}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setShowBumpForm(false)}
              className="px-3 py-1 text-red-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mark Done Form */}
      {showDoneForm && (
        <div className="bg-green-50 p-3 rounded-md space-y-2">
          <div className="text-sm font-medium text-green-800">What did you complete?</div>
          <input
            type="text"
            value={doneText}
            onChange={(e) => setDoneText(e.target.value)}
            placeholder="What got done..."
            className="w-full px-3 py-2 border border-green-200 rounded-md text-sm"
          />
          <input
            type="text"
            value={doneTest}
            onChange={(e) => setDoneTest(e.target.value)}
            placeholder="How do you know it's done? (optional)"
            className="w-full px-3 py-2 border border-green-200 rounded-md text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleMarkDone}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
            >
              Mark Done
            </button>
            <button
              onClick={() => setShowDoneForm(false)}
              className="px-3 py-1 text-green-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Remove Bump Buttons (if bumps exist) */}
      {thread.workingOn.bumps.length > 0 && !showBumpForm && (
        <div className="text-xs text-gray-500">
          Click ⚠️ Add Bump to manage blockers
        </div>
      )}
    </div>
  );
}
