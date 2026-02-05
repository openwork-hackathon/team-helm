# HELM Token Economic Model
## Interactive Spreadsheet

---

## Scenario A: Conservative Launch (Month 1)

### Assumptions
- 10 total users
- 5 Free tier (0 HELM staked)
- 4 HELM tier (1,000 HELM avg)
- 1 Navigator tier (2,000 HELM avg)
- Average buy price: $0.002 (mixed tiers)

### Token Distribution
| Tier | Users | HELM/User | Total HELM | $Value |
|------|-------|-----------|------------|--------|
| Free | 5 | 0 | 0 | $0 |
| HELM | 4 | 1,000 | 4,000 | $8 |
| Navigator | 1 | 2,000 | 2,000 | $4 |
| **Total** | **10** | - | **6,000** | **$12** |

### Monthly Revenue
| Source | Calculation | Amount |
|--------|-------------|--------|
| Mint Royalties (3%) | $20 new buys × 3% | $0.60 |
| Burn Royalties (3%) | $10 sells × 3% | $0.30 |
| **Total Revenue** | | **$0.90/month** |

### Monthly Costs
| Service | Cost |
|---------|------|
| OpenAI API | $30 |
| Vercel KV | $20 |
| Vercel Hosting | $20 |
| **Total Costs** | **$70/month** |

### Result: -$69.10/month (fund from savings/earnings)

---

## Scenario B: Growth (Month 3)

### Assumptions
- 100 total users
- 50 Free tier
- 40 HELM tier (1,500 HELM avg)
- 10 Navigator tier (2,500 HELM avg)
- Average buy price: $0.004 (price rose)

### Token Distribution
| Tier | Users | HELM/User | Total HELM | $Value |
|------|-------|-----------|------------|--------|
| Free | 50 | 0 | 0 | $0 |
| HELM | 40 | 1,500 | 60,000 | $240 |
| Navigator | 10 | 2,500 | 25,000 | $100 |
| **Total** | **100** | - | **85,000** | **$340** |

### Monthly Revenue
| Source | Calculation | Amount |
|--------|-------------|--------|
| Mint Royalties | $500 new buys × 3% | $15 |
| Burn Royalties | $200 sells × 3% | $6 |
| Protocol Fees | 50 paid users × $2 | $100 |
| **Total Revenue** | | **$121/month** |

### Monthly Costs
| Service | Cost |
|---------|------|
| OpenAI API | $80 |
| Vercel KV | $40 |
| Vercel Hosting | $20 |
| **Total Costs** | **$140/month** |

### Result: -$19/month (nearly break-even!)

---

## Scenario C: Sustainable (Month 6)

### Assumptions
- 500 total users
- 200 Free tier
- 250 HELM tier (2,000 HELM avg)
- 45 Navigator tier (5,000 HELM avg)
- 5 Fleet tier (20,000 HELM avg)
- Average buy price: $0.006

### Token Distribution
| Tier | Users | HELM/User | Total HELM | $Value |
|------|-------|-----------|------------|--------|
| Free | 200 | 0 | 0 | $0 |
| HELM | 250 | 2,000 | 500,000 | $3,000 |
| Navigator | 45 | 5,000 | 225,000 | $1,350 |
| Fleet | 5 | 20,000 | 100,000 | $600 |
| **Total** | **500** | - | **825,000** | **$4,950** |

### Monthly Revenue
| Source | Calculation | Amount |
|--------|-------------|--------|
| Mint Royalties | $2,000 new buys × 3% | $60 |
| Burn Royalties | $800 sells × 3% | $24 |
| Protocol Fees | 300 paid users × $3 | $900 |
| **Total Revenue** | | **$984/month** |

### Monthly Costs
| Service | Cost |
|---------|------|
| OpenAI API | $200 |
| Vercel KV | $100 |
| Vercel Hosting | $20 |
| Infrastructure | $50 |
| **Total Costs** | **$370/month** |

### Result: +$614/month PROFIT 🎉

---

## Breakeven Analysis

**Fixed costs:** ~$120-170/month

**Variable revenue per user:**
- Free: $0 (but minimal cost)
- HELM tier: ~$0.80/month avg (staking + fees)
- Navigator tier: ~$2.50/month avg
- Fleet tier: ~$10/month avg

**Breakeven:** ~60 paid users or ~150 total users

---

## Token Price Trajectory

### Bonding Curve Mechanics

```
Current Supply: 100,000 HELM
Price: $0.002

Buy 1,000 HELM → Price rises to $0.0021
Buy 10,000 HELM → Price rises to $0.003
Buy 100,000 HELM → Price rises to $0.005

Early buyers get 5-10x better prices than late buyers.
```

### Price Scenarios

| Scenario | Supply | Price | Market Cap | Timeline |
|----------|--------|-------|------------|----------|
| Launch | 0 | N/A | $0 | Day 0 |
| First 10 users | 10,000 | $0.001 | $10 | Week 1 |
| 100 users | 100,000 | $0.002 | $200 | Month 1 |
| 500 users | 500,000 | $0.005 | $2,500 | Month 6 |
| 1,000 users | 1,000,000 | $0.008 | $8,000 | Month 12 |

**Note:** These are rough estimates. Actual prices depend on buy/sell pressure.

---

## Key Insights

### 1. Early Adopter Advantage
- First buyers get tokens at $0.001
- Price rises to $0.01 at full supply
- 10x potential for early supporters

### 2. Staking Reduces Sell Pressure
- 80% of tokens likely staked for features
- Only 20% circulating = price stability
- Long-term holders rewarded

### 3. Multiple Revenue Streams
- Trading fees (mint/burn)
- Protocol usage fees
- Premium feature subscriptions
- Not dependent on one source

### 4. Deflationary Over Time
- 1% of usage fees burned
- Scarcity increases as product matures
- Value accrues to long-term holders

### 5. Real Utility First
- Token has immediate use (feature access)
- No speculative "future promise"
- Users buy because they want the product

---

## Risk Scenarios

### Worst Case: Only 10 Users
- Revenue: $10/month
- Costs: $170/month
- Loss: $160/month
- **Mitigation:** Must complete paid missions to subsidize

### Base Case: 50 Users  
- Revenue: $50/month
- Costs: $170/month
- Loss: $120/month
- **Mitigation:** Break-even in Month 3-4 with growth

### Best Case: 200 Users
- Revenue: $300/month
- Costs: $250/month
- Profit: $50/month
- **Result:** Self-sustaining, can hire/help more agents

---

## Conclusion

**HELM token is economically viable at 60-100 paid users.**

With the Openwork hackathon exposure, Moltbook community, and genuine utility, reaching 100 users in 3 months is realistic.

**The model:**
- ✅ No VC backing required
- ✅ Launch cost: $0.01
- ✅ Break-even: 100 users
- ✅ Profitability: 300+ users
- ✅ Sustainability: Built into the design

**Ready to deploy?** 🚀
