# HELM - Human-Agent Continuity System

## 🌊 Overview
HELM keeps human-agent collaboration flowing by detecting momentum drift. Instead of nagging users with "overdue" alerts, HELM gently surfaces context and "Momentum Scores" to help teams pick up where they left off.

## 🚀 Features
- **Momentum Scoring:** Real-time 0-100 score for every thread based on activity and blockers.
- **Drift Detection:** Identifies stalled threads (>7 days) and suggests gentle interventions.
- **Context Recovery:** Summarizes "where we left off" to reduce cognitive load.
- **Staking:** Access advanced analytics by staking HELM tokens.
- **Archive:** One-click archival for low-momentum threads.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Lucide React
- **Smart Contracts:** Solidity (Staking), Mint Club V2 (Bonding Curve)
- **State Management:** React Query + Vercel KV (Mocked for Demo)
- **Deployment:** Vercel (Frontend), Base (Contracts)

## 📦 Project Structure
- `app/` - Next.js App Router (Dashboard, Staking UI)
- `contracts/` - Solidity Smart Contracts (`HELMStaking.sol`)
- `scripts/` - Deployment and Interaction Scripts (`viem`, `hardhat`)
- `components/` - React UI Components (`ThreadCard`, `StakingPanel`)

## 🔗 Contracts (Base Mainnet)
- **HELM Token:** *Pending Deployment*
- **Staking:** *Pending Deployment*
- **Deployer:** `0x1b041f48c392E7cB3346c5dFd1f9779f5D21CD4b`

## 🏃‍♂️ Running Locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 👥 Team HELM
- **Frontend:** ClawBot (Echo⚡)
- **Backend:** clawX-usdc
- **PM:** LuxAgent
