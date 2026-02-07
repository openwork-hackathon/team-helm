/**
 * HELM Thread Types
 * 
 * Based on GMCLAW heartbeat format - proven pattern for tracking
 * continuity, momentum, and blockers.
 * 
 * Using string dates for JSON serialization compatibility
 * 
 * @see https://gmclaw.xyz/skill.md
 */

export interface Thread {
  id: string;
  name: string;
  description?: string;
  
  // Core heartbeat structure (from GMCLAW)
  workingOn: {
    task: string;              // Current focus
    criticalPath?: string;     // The ONE thing that moves this forward
    bumps: string[];           // Blockers, friction, drift signals
  };
  
  todo: string[];              // Near-term (next few sessions)
  upcoming: string[];          // Future-but-relevant (not urgent, but alive)
  done: CompletedTask[];       // Gracefully completed work
  
  // HELM-specific metadata (ISO strings for JSON)
  lastTouched: string;
  createdAt: string;
  
  // Pattern signals (computed)
  status: ThreadStatus;
}

export interface CompletedTask {
  task: string;
  test?: string;               // How do you know it's done?
  completedAt?: string;
}

export type ThreadStatus = 
  | 'active'      // Touched recently, has momentum
  | 'drifting'    // Untouched for a while, bumps present
  | 'blocked'     // Has active bumps
  | 'paused'      // Intentionally set aside
  | 'complete';   // All done, archived with dignity

/**
 * Pattern detection rules
 */
export const ThreadPatterns = {
  isDrifting: (thread: Thread): boolean => {
    const daysSinceTouch = Math.floor(
      (Date.now() - new Date(thread.lastTouched).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceTouch > 7 && thread.workingOn.bumps.length > 0;
  },
  
  isBlocked: (thread: Thread): boolean => {
    return thread.workingOn.bumps.length > 0;
  },
  
  isActive: (thread: Thread): boolean => {
    const daysSinceTouch = Math.floor(
      (Date.now() - new Date(thread.lastTouched).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceTouch < 3;
  },
  
  needsAttention: (thread: Thread): boolean => {
    return ThreadPatterns.isDrifting(thread) || 
           ThreadPatterns.isBlocked(thread);
  },

  getMomentumScore: (thread: Thread): number => {
    if (thread.status === 'complete') return 100;
    
    let score = 100;
    
    // Decay: -5 per day since touch (grace period: 2 days)
    const daysSinceTouch = Math.max(0, Math.floor(
      (Date.now() - new Date(thread.lastTouched).getTime()) / (1000 * 60 * 60 * 24)
    ) - 2);
    score -= daysSinceTouch * 5;
    
    // Bumps: -15 per active bump
    score -= thread.workingOn.bumps.length * 15;
    
    // Clamp
    return Math.max(0, Math.min(100, score));
  }
};

/**
 * Gentle prompts based on thread state
 */
export const GentlePrompts = {
  drifting: (thread: Thread, days: number): string => {
    if (thread.workingOn.bumps.length > 0) {
      return `It's been ${days} days since you touched "${thread.name}". You have ${thread.workingOn.bumps.length} bump(s). Still relevant?`;
    }
    return `"${thread.name}" has been quiet for ${days} days. Still alive or ready to pause gracefully?`;
  },
  
  blocked: (thread: Thread): string => {
    const bumps = thread.workingOn.bumps.join(', ');
    return `"${thread.name}" has bumps: ${bumps}. Want to talk through them?`;
  },
  
  criticalPath: (thread: Thread): string => {
    if (!thread.workingOn.criticalPath) {
      return `What's the ONE thing that would move "${thread.name}" forward?`;
    }
    return `Critical path for "${thread.name}": ${thread.workingOn.criticalPath}`;
  },
  
  completion: (thread: Thread): string => {
    const recentDone = thread.done.slice(-3).map(d => d.task).join(', ');
    return `Nice progress on "${thread.name}": ${recentDone}. How does it feel?`;
  }
};
