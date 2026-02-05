# HELM Token
## Human-Agent Continuity Infrastructure

**Symbol:** HELM  
**Chain:** Base (Ethereum L2)  
**Standard:** ERC-20 via Mint Club V2  
**Launch Model:** Bonding Curve (no initial liquidity required)

---

## 1. Token Parameters

### Core Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Name** | HELM Token | Brand alignment |
| **Symbol** | HELM | Memorable, unique |
| **Decimals** | 18 | Standard ERC-20 |
| **Max Supply** | 10,000,000 HELM | Scarce but accessible |
| **Mint Royalty** | 3% | Sustainable development |
| **Burn Royalty** | 3% | Deflationary pressure |
| **Reserve Token** | $OPENWORK | Aligns with ecosystem |

### Bonding Curve Design

**Stepped Bonding Curve** (3 tiers):

```
Tier 1: 0 - 1,000,000 HELM @ 0.001 $OPENWORK/HELM
Tier 2: 1,000,001 - 5,000,000 HELM @ 0.005 $OPENWORK/HELM  
Tier 3: 5,000,001 - 10,000,000 HELM @ 0.01 $OPENWORK/HELM
```

**Early adopter advantage:** First 1M tokens are 10x cheaper than final tier.

### Economic Model

**Creator Revenue Streams:**
1. **Mint Royalty:** 3% of every buy → Team wallet
2. **Burn Royalty:** 3% of every sell → Team wallet
3. **Staking Revenue:** Protocol fees from premium features

**Token Utility:**
1. **Feature Access:** Stake HELM → unlock tiers
2. **Governance:** Vote on protocol parameters
3. **Discounts:** Pay fees in HELM for discounts
4. **Burn Mechanism:** 1% of usage fees → burn

---

## 2. Staking Tiers (Utility)

### Free Tier (0 HELM)
- 3 active threads
- Basic drift detection (time-based)
- Weekly gentle prompts
- Community support

### HELM Tier (Stake 1,000 HELM)
- Unlimited threads
- AI-powered pattern detection
- Daily gentle prompts
- Email/signal integration
- Priority API access

### Navigator Tier (Stake 10,000 HELM)
- Everything in HELM Tier
- Multi-agent collaboration
- Custom integrations (Moltbook, GMCLAW, Openwork)
- Advanced analytics dashboard
- Direct support channel

### Fleet Tier (Stake 100,000 HELM)
- Everything in Navigator
- White-label deployment
- API access for external apps
- Governance voting rights
- Revenue share from protocol fees

---

## 3. Cost Sustainability Math

### API Cost Reality

**Current HELM operational costs (monthly):**
- OpenAI API (GPT-4): ~$50-100
- Vercel KV: ~$20
- Vercel hosting: ~$20
- Anthropic API: ~$30
- **Total: ~$120-170/month**

### Revenue Projections

**Conservative Scenario (100 users):**
- 50 Free users (cost: $0 revenue, minimal compute)
- 40 HELM Tier stakers (avg 1,500 HELM @ $0.005 = $300 value)
- 10 Navigator stakers (avg 2,000 HELM @ $0.005 = $100 value)

**With 3% mint/burn royalties:**
- Monthly trading volume: $1,000
- Creator revenue: $60/month
- **Result: Break-even at ~100 users**

**Growth Scenario (1,000 users):**
- Trading volume: $10,000/month
- Creator revenue: $600/month
- Staking lock-ups reduce sell pressure
- **Result: $400+/month profit → funds development**

### The Flywheel

```
1. Users buy HELM to access features
   → Price rises (bonding curve)
   → Creator earns 3% mint fee

2. Users stake HELM (don't sell)
   → Reduced circulating supply
   → Price stability
   → Features improve with revenue

3. Feature improvements attract more users
   → More buy pressure
   → Higher creator revenue
   → Better product

4. Protocol fees burn 1% HELM
   → Deflationary over time
   → Value accrues to holders
```

---

## 4. Launch Strategy (No Backing Required)

### Phase 0: Bootstrap (Week 1)

**MVP Complete:**
- ✅ Thread dashboard working
- ✅ GMCLAW format integrated
- ✅ Basic pattern detection

**Token Launch:**
- Deploy Mint Club token ($0.01 gas)
- Set initial parameters
- Create staking contracts (simple ERC-20 lock)

### Phase 1: Proof of Value (Week 2-4)

**Demonstrate utility:**
1. Launch with 1 staker (you/Billy)
2. Use HELM for real feature access
3. Document usage, iterate
4. Share on Moltbook, Openwork, GMCLAW

**No marketing budget needed:**
- Post on Moltbook (agent community)
- Share in Openwork hackathon
- GMCLAW heartbeat mentions
- Organic growth from users who need this

### Phase 2: Earn & Build (Month 2-3)

**Parallel revenue streams:**
1. Complete Openwork missions (fund development)
2. Security audit mission (85M $OPENWORK = $850)
3. Token trading volume generates fees

**Reinvest 100% into:**
- API costs (sustainability)
- Feature development
- Bug fixes, polish

### Phase 3: Sustainable Growth (Month 3+)

**Self-funding achieved:**
- Creator fees cover API costs
- New features attract users
- Community governance begins
- Optional: Revenue share to Fleet stakers

---

## 5. Risk Mitigation

### Token Risk: Low
- Bonding curve = always liquid
- No pre-mine = fair launch
- Utility first = real demand

### Technical Risk: Low
- Mint Club = battle-tested contracts
- Simple staking = minimal attack surface
- Gradual feature rollouts

### Financial Risk: Minimal
- $0.01 launch cost
- Revenue-funded development
- No investor obligations

### Sustainability Risk: Medium
- **Mitigation:** Multiple revenue streams
- **Mitigation:** Low burn rate ($120-170/month)
- **Mitigation:** Treasury buffer from early fees

---

## 6. Success Metrics

### Month 1 Goals
- [ ] Token deployed on Base
- [ ] 1 real user (besides team)
- [ ] Break-even on API costs

### Month 3 Goals
- [ ] 50 active users
- [ ] $500/month revenue
- [ ] 3 major features shipped

### Month 6 Goals
- [ ] 500 active users
- [ ] Self-sustaining (revenue > costs)
- [ ] Governance launch

---

## 7. Why This Works

**1. Real Problem:**
- Agents forget context (we've seen this on Moltbook)
- Humans lose momentum on open work
- Existing tools add pressure, not support

**2. Proven Demand:**
- FogMemory team building similar (convergent evolution)
- Top Moltbook post: "memory after compression"
- GMCLAW heartbeat: agents need continuity

**3. Sustainable Model:**
- Users pay for value received
- Fees proportional to usage
- No artificial scarcity or hype

**4. Ecosystem Alignment:**
- Built on Base (fast, cheap)
- Reserve in $OPENWORK (ecosystem alignment)
- Integrates with Moltbook, GMCLAW, Openwork

**5. Fair Launch:**
- No pre-mine
- No VC backing required
- Community-first from day 1

---

## 8. Call to Action

**To launch HELM token:**

1. **Approve parameters** (this doc)
2. **Fund wallet** (~$0.01 ETH on Base)
3. **Deploy token** (Mint Club V2)
4. **Integrate staking** into HELM app
5. **Announce** to Moltbook/Openwork communities

**Timeline:** Launch possible within 24 hours of approval.

**Cost:** $0.01 gas + time

**Potential:** First sustainable human-agent continuity infrastructure.

---

*Built with 🦞 during the Openwork Clawathon*  
*For humans who want to stay connected to what matters, without the weight.*
