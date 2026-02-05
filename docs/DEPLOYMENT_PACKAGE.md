# HELM Token Deployment Package

Prepared by: Sub-agent for HELM  
Date: 2026-02-05  
Status: **READY FOR REVIEW**

---

## 📁 Package Contents

```
helm/
├── contracts/
│   └── HELMStaking.sol          # ERC-20 staking contract for tiers
├── scripts/
│   ├── deploy-token.js          # Mint Club V2 deployment (viem/ethers)
│   ├── deploy-staking.js        # Staking contract deployment
│   └── package.json             # Dependencies
├── docs/
│   ├── DEPLOYMENT_CHECKLIST.md  # Step-by-step deployment guide
│   ├── LAUNCH_ANNOUNCEMENT.md   # Moltbook launch post
│   └── ENV_SETUP.md             # Environment configuration
├── HELM_TOKEN_WHITEPAPER.md     # (existing) Token design
└── HELM_TOKEN_ECONOMICS.md      # (existing) Economic model
```

---

## ✅ Completed Tasks

### 1. Read Whitepaper & Economics ✓
- Max supply: 10,000,000 HELM
- Reserve token: $OPENWORK
- 3% mint/burn royalties
- Stepped bonding curve (3 tiers)

### 2. Deployment Checklist ✓
- Created comprehensive checklist in `docs/DEPLOYMENT_CHECKLIST.md`
- Covers: wallet prep → deployment → integration → launch → monitoring

### 3. Mint Club V2 Deployment Script ✓
- File: `scripts/deploy-token.js`
- Uses viem + ethers.js
- Configured for Base mainnet
- Stepped bonding curve encoding
- Saves deployment info to JSON

### 4. Staking Contract Skeleton ✓
- File: `contracts/HELMStaking.sol`
- Simple ERC-20 lock contract
- 4 tiers: Free (0) / HELM (1,000) / Navigator (10,000) / Fleet (100,000)
- Events for tier upgrades/downgrades
- Emergency token recovery (owner only)
- OpenZeppelin dependencies

### 5. Launch Announcement ✓
- File: `docs/LAUNCH_ANNOUNCEMENT.md`
- Ready to post on Moltbook
- Includes: token details, utility, buying guide, staking guide, risks

---

## 🔧 Blockers / Items Needing Input

### Before Deployment

1. **Reserve Token Address** ⭐ CRITICAL
   - Need official $OPENWORK token address on Base
   - Used in bonding curve configuration

2. **Mint Club V2 Contract Addresses** ⭐ CRITICAL
   - Factory contract address on Base
   - Bonding curve contract address on Base
   - Check Mint Club docs: https://docs.mint.club

3. **Deployer Wallet**
   - Need wallet with ETH on Base (~$5-10 for gas)
   - Private key for `DEPLOYER_PRIVATE_KEY` env var

4. **Contract Compilation**
   - Staking contract needs to be compiled
   - Command: `solc --bin contracts/HELMStaking.sol`
   - Bytecode needed for `deploy-staking.js`

5. **Basescan API Key** (Optional)
   - For automatic contract verification
   - Can verify manually on basescan.org otherwise

### Nice to Have

6. **Base Sepolia Testnet**
   - Deploy to testnet first to verify
   - Need Base Sepolia ETH from faucet

7. **Team Multi-sig**
   - For treasury/royalty receiver (if significant funds expected)

---

## 🚀 Quick Start (After Blockers Resolved)

```bash
# 1. Install dependencies
cd ~/.openclaw/workspace/helm/scripts
npm install

# 2. Create .env file
cat > .env << 'EOF'
DEPLOYER_PRIVATE_KEY=0x...
DEPLOYER_ADDRESS=0x...
BASE_RPC=https://mainnet.base.org
HELM_NAME=HELM Token
HELM_SYMBOL=HELM
RESERVE_TOKEN=0x...  # OPENWORK address
CREATOR_ADDRESS=0x...
EOF

# 3. Deploy token
node deploy-token.js

# 4. Update HELM_TOKEN_ADDRESS in env, then deploy staking
node deploy-staking.js

# 5. Verify contracts on Basescan
# 6. Post LAUNCH_ANNOUNCEMENT.md on Moltbook
```

---

## 📊 Summary

| Deliverable | Status | Location |
|-------------|--------|----------|
| Deployment Checklist | ✅ Ready | `docs/DEPLOYMENT_CHECKLIST.md` |
| Token Deployment Script | ✅ Ready | `scripts/deploy-token.js` |
| Staking Contract | ✅ Ready (needs compile) | `contracts/HELMStaking.sol` |
| Staking Deployment Script | ✅ Ready | `scripts/deploy-staking.js` |
| Launch Announcement | ✅ Ready | `docs/LAUNCH_ANNOUNCEMENT.md` |
| Environment Setup Guide | ✅ Ready | `docs/ENV_SETUP.md` |

---

## 📝 Review Notes for Billy & Wuf Grr

### Staking Contract
- Simple and secure (minimal attack surface)
- Uses OpenZeppelin's SafeERC20 and ReentrancyGuard
- No complex reward calculations (just tier-based access)
- Consider adding a timelock for unstaking? (currently instant)

### Token Deployment
- Script handles stepped bonding curve encoding
- Saves deployment info to JSON for record-keeping
- Includes helper functions for buy/sell/price queries

### Economic Model
- Conservative break-even: ~60 paid users
- Profitability: ~300+ users
- Multiple revenue streams built in

---

**Ready for review! Address blockers and this can be deployed within 24 hours.**

🦞⚓🚀
