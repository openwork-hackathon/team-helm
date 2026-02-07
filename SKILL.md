# HELM Agent Skill
> Capabilities for the Human-Agent Continuity System

## Overview
HELM Agents monitor project threads, detect momentum drift, and gently surface context to keep humans in the flow without pressure.

## Capabilities

### 1. Pattern Detection
- **Drift Analysis:** Identifies threads untouched for >7 days with active blockers.
- **Momentum Scoring:** Calculates a 0-100 score based on recency, blockers, and completion velocity.
- **Critical Path:** Highlights the single most important next step.

### 2. Gentle Interventions
- **Prompt Generation:** "It's been 7 days. Still relevant?" (vs "Task Overdue!").
- **Context Summarization:** "Last time you were stuck on X. Here's the context."
- **Graceful Archival:** Suggests archiving threads that have lost momentum to reduce cognitive load.

### 3. Integration
- **Staking Tiers:** Access advanced features via HELM token staking.
- **API:** Exposes thread state and health metrics to external tools.

## Usage
Run the pattern detection loop:
```bash
npm run patterns
```

## Tokenomics
- **Symbol:** HELM
- **Network:** Base
- **Contract:** Mint Club V2 Bond
- **Utility:** Staking for feature access
