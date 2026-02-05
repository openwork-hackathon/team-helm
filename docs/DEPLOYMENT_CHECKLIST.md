# HELM Token Deployment Checklist

## Pre-Deployment

### 1. Wallet Preparation
- [ ] Ensure deployer wallet has ETH on Base (~$5-10 for gas)
- [ ] Verify wallet address: `____________________`
- [ ] Confirm private key is securely stored (env var, not hardcoded)
- [ ] Test wallet connection to Base Mainnet

### 2. Token Parameters Final Review
- [ ] Name: HELM Token
- [ ] Symbol: HELM
- [ ] Decimals: 18
- [ ] Max Supply: 10,000,000 HELM
- [ ] Mint Royalty: 3%
- [ ] Burn Royalty: 3%
- [ ] Reserve Token: $OPENWORK (0x ____________________)
- [ ] Stepped bonding curve tiers confirmed

### 3. Reserve Token Acquisition
- [ ] Acquire $OPENWORK tokens for initial liquidity (if needed)
- [ ] Amount to acquire: ____________________ $OPENWORK
- [ ] Source: ____________________

### 4. Contract Dependencies
- [ ] Mint Club V2 contracts verified on Base
- [ ] Reserve token contract address confirmed
- [ ] Bonding curve parameters calculated

---

## Deployment Phase

### 5. Token Deployment (Mint Club V2)
```bash
# Run deployment script
node scripts/deploy-token.js
```
- [ ] Deployment script executed
- [ ] Token address recorded: `____________________`
- [ ] Deployment tx hash: `____________________`
- [ ] Contract verified on Basescan (optional but recommended)

### 6. Staking Contract Deployment
```bash
# Deploy staking contract
node scripts/deploy-staking.js
```
- [ ] Staking contract deployed
- [ ] Staking address recorded: `____________________`
- [ ] Deployment tx hash: `____________________`
- [ ] HELM token approved for staking contract

### 7. Initial Configuration
- [ ] Set royalty receiver address (team wallet)
- [ ] Verify bonding curve is active
- [ ] Test buy/sell functions
- [ ] Confirm mint/burn royalties working

---

## Integration Phase

### 8. HELM App Integration
- [ ] Update `.env` with token addresses:
  ```
  HELM_TOKEN_ADDRESS=
  HELM_STAKING_ADDRESS=
  ```
- [ ] Add staking tier checks to middleware
- [ ] Integrate wallet connection (RainbowKit/wagmi)
- [ ] Add staking/unstaking UI components

### 9. Tier System Implementation
- [ ] Free tier: 0 HELM (3 threads, basic drift)
- [ ] HELM tier: 1,000 HELM staked (unlimited threads, AI patterns)
- [ ] Navigator tier: 10,000 HELM staked (multi-agent, integrations)
- [ ] Fleet tier: 100,000 HELM staked (white-label, governance)

### 10. Testing
- [ ] Test token purchase flow
- [ ] Test staking flow (stake → tier upgrade)
- [ ] Test unstaking flow (unstake → tier downgrade)
- [ ] Test feature gating by tier
- [ ] Test royalty distribution

---

## Launch Phase

### 11. Documentation
- [ ] Update README with token info
- [ ] Publish staking guide
- [ ] Create token FAQ
- [ ] Document tier benefits clearly

### 12. Community Announcement
- [ ] Post on Moltbook
- [ ] Share in Openwork community
- [ ] GMCLAW heartbeat announcement
- [ ] Cross-post to relevant channels

### 13. Monitoring Setup
- [ ] Set up Basescan monitoring
- [ ] Configure DEXScreener alerts (when listed)
- [ ] Set up trading volume tracking
- [ ] Monitor staking TVL

---

## Post-Launch (Week 1)

### 14. Initial Traction
- [ ] Team members stake HELM
- [ ] First external user onboarding
- [ ] First organic token purchase
- [ ] Feedback collection

### 15. Treasury Management
- [ ] Set up team wallet for royalties
- [ ] Document initial treasury balance
- [ ] Plan first month API cost coverage
- [ ] Consider multi-sig for treasury (if >$1k)

---

## Success Metrics Check

### Month 1 Goals
- [ ] Token deployed
- [ ] 1 real user (besides team)
- [ ] Break-even on API costs

### Month 3 Goals
- [ ] 50 active users
- [ ] $500/month revenue
- [ ] 3 major features shipped

---

## Emergency Contacts / Blockers

| Issue | Contact | Status |
|-------|---------|--------|
| Contract bug | Billy / Wuf Grr | ⏳ Pre-launch |
| Integration issue | Billy | ⏳ Pre-launch |
| Funding needed | Billy | ⏳ Pre-launch |
| Marketing support | Moltbook community | ⏳ Launch |

---

## Notes

**Deployment Date:** ___________
**Deployed By:** ___________
**Reviewed By:** Billy, Wuf Grr

**Blockers:**
- 

**Decisions Made:**
- 
