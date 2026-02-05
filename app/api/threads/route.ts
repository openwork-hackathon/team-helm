import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Thread } from '@/types/thread';

const THREADS_KEY = 'helm:threads';

// Helper to get threads from KV or fallback to mock
async function getThreads(): Promise<Thread[]> {
  try {
    const threads = await kv.get<Thread[]>(THREADS_KEY);
    return threads || getMockThreads();
  } catch {
    // KV not connected yet, use mock
    return getMockThreads();
  }
}

// Helper to save threads
async function saveThreads(threads: Thread[]): Promise<void> {
  try {
    await kv.set(THREADS_KEY, threads);
  } catch {
    // KV not connected, data lost on restart (dev mode)
    console.log('KV not connected - using in-memory only');
  }
}

function getMockThreads(): Thread[] {
  return [
    {
      id: '1',
      name: 'HELM Hackathon',
      description: 'Building human-agent continuity system for Clawathon',
      workingOn: {
        task: 'Implement thread dashboard UI with real persistence',
        criticalPath: 'Wire up Vercel KV storage',
        bumps: []
      },
      todo: ['Deploy Mint Club token', 'Add pattern detection cron'],
      upcoming: ['Recruit frontend collaborator', 'Write launch post'],
      done: [
        { task: 'Team created', test: 'Repo live on GitHub' },
        { task: 'Next.js scaffold', test: 'Deploys to Vercel' },
        { task: 'Adopted GMCLAW format', test: 'Types defined' }
      ],
      lastTouched: new Date().toISOString(),
      createdAt: new Date('2026-02-05').toISOString(),
      status: 'active'
    },
    {
      id: '2',
      name: 'Security Audit Mission',
      description: 'Cross-platform analytics dashboard (9M $OPENWORK!)',
      workingOn: {
        task: 'Evaluate if we have bandwidth for this',
        bumps: ['Time commitment vs HELM build']
      },
      todo: ['Review 7 competing submissions', 'Plan audit approach'],
      upcoming: [],
      done: [],
      lastTouched: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date('2026-02-05').toISOString(),
      status: 'active'
    }
  ];
}

export async function GET() {
  const threads = await getThreads();
  return NextResponse.json({ threads });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const threads = await getThreads();
  
  const newThread: Thread = {
    id: Date.now().toString(),
    name: body.name,
    description: body.description || '',
    workingOn: {
      task: body.task || '',
      criticalPath: body.criticalPath || '',
      bumps: []
    },
    todo: body.todo || [],
    upcoming: body.upcoming || [],
    done: [],
    lastTouched: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  
  threads.push(newThread);
  await saveThreads(threads);
  
  return NextResponse.json({ thread: newThread });
}
