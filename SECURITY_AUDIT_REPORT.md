# HELM Codebase Security Audit Report

**Audit Date:** 2026-02-05  
**Auditor:** Security Subagent  
**Scope:** Smart Contracts, API Routes, Dependencies, Deployment Scripts  
**Severity Scale:** Critical / High / Medium / Low

---

## Executive Summary

The HELM codebase contains several security concerns ranging from **Critical** to **Low** severity. The most serious issues are in the API layer (authentication gaps, input validation) and deployment scripts (private key handling). The smart contract follows good practices with OpenZeppelin libraries but lacks emergency controls.

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Smart Contracts | 0 | 0 | 2 | 2 |
| API Security | 0 | 2 | 2 | 1 |
| Dependencies | 0 | 0 | 1 | 1 |
| Deployment Scripts | 1 | 2 | 2 | 1 |
| **TOTAL** | **1** | **4** | **7** | **5** |

---

## 1. Smart Contract Review (HELMStaking.sol)

### ✅ Positive Security Practices
- Uses `ReentrancyGuard` from OpenZeppelin for reentrancy protection
- Uses `SafeERC20` for secure ERC-20 token transfers
- `nonReentrant` modifier applied to all state-changing functions
- `recoverToken()` correctly prevents recovery of HELM tokens
- Solidity version ^0.8.20 (safe from integer overflow/underflow)
- `helmToken` is marked `immutable` (gas optimization + security)

### 🔴 Findings

#### [MEDIUM] SC-001: No Emergency Pause Mechanism
**Location:** Contract-level  
**Description:** The contract lacks a `Pausable` pattern. In case of discovered vulnerabilities or exploits, there is no way to freeze contract operations.  
**Recommendation:** Implement OpenZeppelin's `Pausable` contract with `whenNotPaused` modifiers on stake/unstake functions. Only owner should be able to pause/unpause.

```solidity
// Recommended addition:
import "@openzeppelin/contracts/security/Pausable.sol";

function stake(uint256 _amount) external nonReentrant whenNotPaused { ... }
function unpause() external onlyOwner { ... }
```

---

#### [MEDIUM] SC-002: Missing Events for Admin Functions
**Location:** `recoverToken()` function (line ~208)  
**Description:** The `recoverToken()` function emits no event, making it difficult to track emergency token recoveries on-chain.  
**Recommendation:** Add event emission:
```solidity
event TokensRecovered(address indexed token, uint256 amount, address indexed to);
```

---

#### [LOW] SC-003: No Minimum Stake Duration
**Location:** `stake()` and `unstake()` functions  
**Description:** Users can stake and immediately unstake, potentially enabling flash-loan-like attacks on tier-based access systems that check stake amounts.  
**Recommendation:** Consider adding a minimum stake duration:
```solidity
uint256 public constant MIN_STAKE_DURATION = 1 days;
require(block.timestamp >= userStake.since + MIN_STAKE_DURATION, "Stake locked");
```

---

#### [LOW] SC-004: Tier Calculation May Be Manipulated
**Location:** `getTier()` function  
**Description:** Tier is calculated dynamically based on current stake. A user could temporarily stake to access features, then unstake. If external systems cache tier results, they may be working with stale data.  
**Recommendation:** Document this behavior clearly. Consider emitting events when tier changes that off-chain indexers can subscribe to.

---

## 2. API Security Review (app/api/threads/route.ts)

### 🔴 Findings

#### [HIGH] API-001: No Authentication/Authorization
**Location:** GET and POST handlers  
**Severity:** HIGH  
**Description:** The API endpoints accept requests from any source without authentication. Anyone can:
- Read all thread data (potential data leak)
- Create unlimited threads (resource exhaustion)
- Modify thread data (if extended with PUT/DELETE)

**Recommendation:** Implement authentication middleware:
```typescript
import { auth } from '@clerk/nextjs';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // ... rest of handler
}
```

---

#### [HIGH] API-002: No Input Validation
**Location:** POST handler (body parsing)  
**Severity:** HIGH  
**Description:** User input is accepted without validation:
- `body.name` - no length limits, could accept extremely long strings
- `body.description` - no sanitization, potential for XSS if rendered
- `body.todo`, `body.upcoming` - array length not limited (DoS vector)
- No type checking beyond TypeScript (runtime unchecked)

**Recommendation:** Use a validation library like Zod:
```typescript
import { z } from 'zod';

const threadSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  todo: z.array(z.string().max(200)).max(50),
  upcoming: z.array(z.string().max(200)).max(50),
});
```

---

#### [MEDIUM] API-003: No Rate Limiting
**Location:** All handlers  
**Description:** No protection against brute force or spam attacks. An attacker could:
- Flood the API with thread creation requests
- Exhaust KV storage quotas
- Cause denial of service

**Recommendation:** Implement rate limiting using Vercel KV or Upstash:
```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});
```

---

#### [MEDIUM] API-004: Predictable ID Generation
**Location:** POST handler (`Date.now().toString()`)  
**Description:** IDs are generated from timestamps, making them:
- Predictable (sequential)
- Collision-prone under high concurrency
- Information-leaking (creation time exposed)

**Recommendation:** Use UUID v4 or nanoid:
```typescript
import { nanoid } from 'nanoid';
const id = nanoid();
```

---

#### [LOW] API-005: No CORS Configuration
**Location:** Route handlers  
**Description:** CORS headers are not explicitly configured, potentially allowing unauthorized cross-origin requests depending on Next.js defaults.  
**Recommendation:** Add CORS middleware:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
```

---

## 3. Dependency Audit

### Package Analysis

| Package | Version | Status | Notes |
|---------|---------|--------|-------|
| next | 14.1.0 | ⚠️ | Check for latest security patches |
| @vercel/kv | ^3.0.0 | ✅ | Current stable version |
| react | ^18 | ✅ | Stable |
| viem | ^2.0.0 | ✅ | Modern, actively maintained |
| ethers | ^6.10.0 | ✅ | Stable v6 |
| solc | ^0.8.23 | ✅ | Current version |

### 🔴 Findings

#### [MEDIUM] DEP-001: No Lockfile Present
**Location:** /helm/ directory  
**Description:** No `package-lock.json` or `yarn.lock` file detected. This means:
- Dependencies are not pinned to exact versions
- Supply chain attacks possible via compromised upstream packages
- Reproducible builds not guaranteed

**Recommendation:** Generate and commit lockfile:
```bash
npm install --package-lock-only
# or
npm ci
```

---

#### [LOW] DEP-002: Next.js Version Not Latest
**Location:** package.json  
**Description:** Using Next.js 14.1.0. While not inherently vulnerable, newer versions contain security patches.  
**Recommendation:** Monitor Next.js security advisories and upgrade to latest 14.x or 15.x.

---

#### [INFO] DEP-003: @vercel/kv Usage Analysis
**Location:** route.ts  
**Description:** KV is used with a single hardcoded key (`THREADS_KEY = 'helm:threads'`). Current usage:
- Stores entire threads array as single value
- No user-scoped keys (all users share same data)
- Fallback to mock data on KV failure

**Security Note:** This design means any authenticated user could potentially read/modify all threads if authentication were added.

**Recommendation:** Use user-scoped keys:
```typescript
const userThreadsKey = `helm:threads:${userId}`;
```

---

## 4. Token Deployment Scripts Review

### 🔴 Findings

#### [CRITICAL] SCR-001: Private Key Exposure Risk
**Location:** deploy-token.js, deploy-staking.js  
**Severity:** CRITICAL  
**Description:** Scripts read private keys from environment variables but:
- No warnings about `.env` file security
- Deployment scripts write to JSON files which could be accidentally committed
- Private key validation logs the deployer address (acceptable but should note privacy implications)

**Impact:** If `.env` or deployment JSON files are committed to git, private keys are permanently exposed on chain history.

**Recommendation:**
1. Add `.env` and `deployment-*.json` to `.gitignore` with explicit warnings
2. Add pre-deployment safety check:
```javascript
// Add to both scripts
console.log('🔒 Security Check:');
console.log('   Ensure .env is in .gitignore');
console.log('   Ensure deployment-*.json are in .gitignore');
```
3. Consider using a hardware wallet or KMS for production deployments

---

#### [HIGH] SCR-002: Placeholder Contract Addresses
**Location:** deploy-token.js (MINT_CLUB_V2)  
**Severity:** HIGH  
**Description:** The script contains placeholder addresses:
```javascript
factory: '0xc5A7f8e2cE6c293B56D9E0E8d9B8f6b0E5C4B3A2', // Replace with actual address
bondingCurve: '0xB4A7F8e2cE6c293B56D9E0E8d9B8f6b0E5C4B3A1', // Replace with actual address
```

If deployed without updating, funds could be lost to dummy addresses.

**Recommendation:** Add runtime validation:
```javascript
if (MINT_CLUB_V2.factory === '0xc5A7f8e2cE6c293B56D9E0E8d9B8f6b0E5C4B3A2') {
  throw new Error('Placeholder factory address detected. Update with real address.');
}
```

---

#### [HIGH] SCR-003: Unvalidated RPC Endpoint
**Location:** Both deployment scripts  
**Description:** RPC endpoint from environment variable is used without validation:
```javascript
transport: http(process.env.BASE_RPC || 'https://mainnet.base.org'),
```

A malicious RPC could:
- Return fake transaction receipts
- Front-run transactions
- Censor transactions

**Recommendation:** 
1. Use multiple RPC providers for verification
2. Validate chain ID after connection
3. Document recommended RPC providers

---

#### [MEDIUM] SCR-004: Incomplete Token Address Extraction
**Location:** deploy-token.js `extractTokenAddress()`  
**Description:** The function is a placeholder that may return incorrect addresses:
```javascript
return '0x' + receipt.logs[0]?.topics[1]?.slice(-40) || 'UNKNOWN';
```

**Recommendation:** Implement proper event parsing or require manual address input with confirmation.

---

#### [MEDIUM] SCR-005: Missing Bytecode in deploy-staking.js
**Location:** deploy-staking.js  
**Description:** Script references `STAKING_BYTECODE = '0x...'` as placeholder. If run without proper compilation, deployment will fail or behave unexpectedly.  
**Recommendation:** Add runtime check for valid bytecode before deployment attempt.

---

#### [LOW] SCR-006: SKIP_CONFIRM Environment Variable
**Location:** Both scripts  
**Description:** `SKIP_CONFIRM` allows bypassing deployment confirmation. If set accidentally in production environment, unintended deployments could occur.  
**Recommendation:** Rename to something more explicit like `HELM_PRODUCTION_DEPLOY` and require additional validation for mainnet deployments.

---

## 5. Configuration & Infrastructure

### 🔴 Findings

#### [MEDIUM] CFG-001: Empty .env.local Values
**Location:** .env.local  
**Description:** KV configuration variables are empty but present. This could lead to:
- Silent failures (fallback to mock data)
- Difficulty diagnosing connection issues

**Recommendation:** Add validation in route.ts:
```typescript
if (!process.env.KV_REST_API_URL) {
  console.warn('KV_REST_API_URL not set - using mock data');
}
```

---

#### [LOW] CFG-002: Default Next.js Config
**Location:** next.config.js  
**Description:** Using default configuration without security headers.  
**Recommendation:** Add security headers:
```javascript
const nextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    }];
  },
};
```

---

## 6. Recommendations Summary

### Immediate Actions (Before Production)

1. **[CRITICAL]** Add `.env` and `deployment-*.json` to `.gitignore`
2. **[HIGH]** Implement authentication on API routes
3. **[HIGH]** Add input validation (Zod schema) to API
4. **[HIGH]** Replace placeholder contract addresses with validation

### Short-term (Before Public Launch)

5. **[MEDIUM]** Add rate limiting to API
6. **[MEDIUM]** Implement Pausable pattern in staking contract
7. **[MEDIUM]** Generate and commit package-lock.json
8. **[MEDIUM]** Add user-scoped KV keys

### Long-term (Ongoing)

9. **[LOW]** Add security headers to Next.js config
10. **[LOW]** Implement minimum stake duration
11. **[LOW]** Add monitoring/alerting for contract events
12. **[LOW]** Consider formal verification for staking contract

---

## Appendix: Secure Deployment Checklist

```markdown
□ .env added to .gitignore
□ deployment-*.json added to .gitignore
□ Real contract addresses populated
□ RPC endpoint validated
□ SKIP_CONFIRM not set in production
□ Authentication implemented on API
□ Rate limiting configured
□ Input validation active
□ Contract emergency pause tested
□ Multi-sig owner configured (for production)
```

---

*End of Security Audit Report*
