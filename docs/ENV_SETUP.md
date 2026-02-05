# HELM Token Deployment - Environment Configuration

## Required Environment Variables

Create a `.env` file in the project root:

```bash
# Deployment
DEPLOYER_PRIVATE_KEY=0x...
DEPLOYER_ADDRESS=0x...

# Network (Base Mainnet)
BASE_RPC=https://mainnet.base.org
# Or use Alchemy/Infura:
# BASE_RPC=https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Token Configuration
HELM_NAME=HELM Token
HELM_SYMBOL=HELM
RESERVE_TOKEN=0x... # OPENWORK token address on Base
CREATOR_ADDRESS=0x... # Address to receive royalties

# Deployment Flags
SKIP_CONFIRM=false  # Set to true to skip confirmation prompts
```

## Contract Addresses (Base Mainnet)

### Mint Club V2
```
Factory: [To be filled after lookup]
Bonding Curve: [To be filled after lookup]
```

### Reserve Token (OPENWORK)
```
Address: [To be filled - need official OPENWORK Base address]
```

### Deployed HELM Contracts
```
Token: [Filled after deployment]
Staking: [Filled after deployment]
```

## Package.json Scripts

Add to your package.json:

```json
{
  "scripts": {
    "deploy:token": "node scripts/deploy-token.js",
    "deploy:staking": "node scripts/deploy-staking.js",
    "compile": "solc --bin --abi contracts/HELMStaking.sol -o build",
    "verify": "npx hardhat verify --network base"
  }
}
```

## Dependencies

```bash
npm install viem ethers
npm install -D solc
```

## Security Notes

1. **Never commit .env files**
2. **Use a dedicated deployer wallet** (not your main wallet)
3. **Test on Base Sepolia first**
4. **Verify contracts on Basescan after deployment**
