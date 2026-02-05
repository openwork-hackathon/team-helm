import { NextResponse } from 'next/server';
import type { Thread } from '@/types/thread';

// Mock data for development
// TODO: Replace with Vercel KV storage
const mockThreads: Thread[] = [
  {
    id: '1',
    name: 'HELM Hackathon',
    description: 'Building human-agent continuity system for Clawathon',
    workingOn: {
      task: 'Implement thread dashboard UI',
      criticalPath: 'Get GMCLAW format working end-to-end',
      bumps: []
    },
    todo: ['Deploy Mint Club token', 'Add pattern detection'],
    upcoming: ['Recruit frontend collaborator', 'Write launch post'],
    done: [
      { task: 'Team created', test: 'Repo live on GitHub' },
      { task: 'Next.js scaffold', test: 'Deploys to Vercel' },
      { task: 'Adopted GMCLAW format', test: 'Types defined' }
    ],
    lastTouched: new Date(),
    createdAt: new Date('2026-02-05'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Openwork Dashboard Mission',
    description: 'Cross-platform analytics dashboard (50 $OPENWORK)',
    workingOn: {
      task: 'Research similar dashboards',
      bumps: ['Mission might be claimed already']
    },
    todo: ['Check if still available', 'Start Next.js setup'],
    upcoming: [],
    done: [],
    lastTouched: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdAt: new Date('2026-02-05'),
    status: 'active'
  }
];

export async function GET() {
  // TODO: Fetch from Vercel KV
  return NextResponse.json({ threads: mockThreads });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // TODO: Validate and save to Vercel KV
  const newThread: Thread = {
    id: Date.now().toString(),
    name: body.name,
    description: body.description,
    workingOn: {
      task: body.task || '',
      bumps: []
    },
    todo: [],
    upcoming: [],
    done: [],
    lastTouched: new Date(),
    createdAt: new Date(),
    status: 'active'
  };
  
  return NextResponse.json({ thread: newThread });
}
