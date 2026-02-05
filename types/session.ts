/**
 * Session Persistence for Human-Agent Collaboration
 * 
 * Tracks ongoing conversations/threads between humans and agents
 * Enables continuity across sessions without pressure
 */

export interface HumanAgentSession {
  id: string;
  humanName: string;
  agentName: string;
  
  // Current context (GMCLAW format)
  workingOn: {
    task: string;
    criticalPath?: string;
    bumps: string[];
  };
  
  // Session memory
  todo: string[];              // What we'll do next
  upcoming: string[];          // Future ideas
  done: CompletedItem[];       // What we accomplished
  
  // Continuity tracking
  lastSession: string;         // ISO timestamp
  sessionCount: number;
  totalMessages: number;
  
  // Pattern recognition
  status: 'active' | 'drifting' | 'blocked' | 'paused';
  topics: string[];           // Recurring themes
}

export interface CompletedItem {
  task: string;
  evidence?: string;
  completedAt: string;
}

/**
 * Gentle prompts for session continuity
 */
export const SessionPrompts = {
  returning: (session: HumanAgentSession, daysSince: number): string => {
    if (daysSince > 7) {
      return `Welcome back! It's been ${daysSince} days. Last time we were working on: "${session.workingOn.task}". Still relevant or shall we update?`;
    }
    return `Back again! 👋 Quick refresh: We're working on "${session.workingOn.task}". ${session.workingOn.bumps.length > 0 ? `You had ${session.workingOn.bumps.length} blockers last time.` : ''}`;
  },
  
  checkBumps: (bumps: string[]): string | null => {
    if (bumps.length === 0) return null;
    return `You mentioned these blockers: ${bumps.join(', ')}. Any progress or new ones?`;
  },
  
  suggestNext: (todo: string[]): string | null => {
    if (todo.length === 0) return null;
    return `Next up from our list: "${todo[0]}". Want to tackle this or something else?`;
  },
  
  celebrateDone: (recent: CompletedItem[]): string | null => {
    if (recent.length === 0) return null;
    const last = recent[recent.length - 1];
    return `Last session we completed: "${last.task}". ${last.evidence ? `Evidence: ${last.evidence}` : ''} 🎉`;
  }
};

/**
 * Memory management for sessions
 */
export class SessionMemory {
  private sessions: Map<string, HumanAgentSession> = new Map();
  
  getSession(humanName: string, agentName: string): HumanAgentSession | undefined {
    const key = `${humanName}:${agentName}`;
    return this.sessions.get(key);
  }
  
  createSession(humanName: string, agentName: string, initialTask: string): HumanAgentSession {
    const key = `${humanName}:${agentName}`;
    const session: HumanAgentSession = {
      id: Date.now().toString(),
      humanName,
      agentName,
      workingOn: {
        task: initialTask,
        bumps: []
      },
      todo: [],
      upcoming: [],
      done: [],
      lastSession: new Date().toISOString(),
      sessionCount: 1,
      totalMessages: 0,
      status: 'active',
      topics: []
    };
    this.sessions.set(key, session);
    return session;
  }
  
  updateSession(session: HumanAgentSession): void {
    const key = `${session.humanName}:${session.agentName}`;
    session.lastSession = new Date().toISOString();
    this.sessions.set(key, session);
  }
  
  getContinuityPrompt(session: HumanAgentSession): string {
    const daysSince = Math.floor(
      (Date.now() - new Date(session.lastSession).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const prompts: string[] = [];
    
    // Welcome back
    prompts.push(SessionPrompts.returning(session, daysSince));
    
    // Celebrate recent wins
    const recentDone = session.done.slice(-3);
    const celebrate = SessionPrompts.celebrateDone(recentDone);
    if (celebrate) prompts.push(celebrate);
    
    // Check on blockers
    const bumpCheck = SessionPrompts.checkBumps(session.workingOn.bumps);
    if (bumpCheck) prompts.push(bumpCheck);
    
    // Suggest next step
    const next = SessionPrompts.suggestNext(session.todo);
    if (next) prompts.push(next);
    
    return prompts.join('\n\n');
  }
}

// Singleton instance
export const sessionMemory = new SessionMemory();
