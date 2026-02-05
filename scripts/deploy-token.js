/**
 * HELM Token Deployment Script - Mint Club V2
 * 
 * This script deploys a bonding curve token using Mint Club V2 on Base
 * No initial liquidity required - bonding curve provides instant liquidity
 * 
 * Prerequisites:
 * - Node.js v18+
 * - Environment variables set (see .env.example)
 * - ETH on Base for gas (~$0.01-0.05)
 * 
 * Usage:
 *   node scripts/deploy-token.js
 * 
 * Or with custom parameters:
 *   HELM_NAME="HELM Token" HELM_SYMBOL="HELM" node scripts/deploy-token.js
 */

import { createWalletClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { ethers } from 'ethers';

// ============================================
// CONFIGURATION - Update these for your deployment
// ============================================

const CONFIG = {
  // Token basics
  name: process.env.HELM_NAME || 'HELM Token',
  symbol: process.env.HELM_SYMBOL || 'HELM',
  
  // Bonding curve parameters
  maxSupply: BigInt(10_000_000 * 10**18), // 10M tokens with 18 decimals
  
  // Reserve token (OPENWORK on Base)
  // Replace with actual OPENWORK token address on Base
  reserveToken: process.env.RESERVE_TOKEN || '0x0000000000000000000000000000000000000000',
  
  // Royalties (3% each = 300 basis points)
  mintRoyalty: 300,  // 3% = 300/10000
  burnRoyalty: 300,  // 3% = 300/10000
  
  // Stepped bonding curve tiers
  // Format: [supply point, price at that point]
  curveSteps: [
    { supply: BigInt(0), price: parseEther('0.001') },                    // Tier 1 start: 0.001 OPENWORK/HELM
    { supply: BigInt(1_000_000 * 10**18), price: parseEther('0.005') },   // Tier 2 start: 0.005 OPENWORK/HELM
    { supply: BigInt(5_000_000 * 10**18), price: parseEther('0.01') },    // Tier 3 start: 0.01 OPENWORK/HELM
    { supply: BigInt(10_000_000 * 10**18), price: parseEther('0.01') },   // Max supply cap
  ],
  
  // Creator address (receives royalties)
  creator: process.env.CREATOR_ADDRESS || process.env.DEPLOYER_ADDRESS,
};

// Mint Club V2 Contract Addresses on Base
const MINT_CLUB_V2 = {
  // Main contract for creating tokens
  factory: '0xc5A7f8e2cE6c293B56D9E0E8d9B8f6b0E5C4B3A2', // Replace with actual address
  // Bonding curve contract
  bondingCurve: '0xB4A7F8e2cE6c293B56D9E0E8d9B8f6b0E5C4B3A1', // Replace with actual address
};

// ============================================
// CONTRACT ABIs (Mint Club V2 simplified)
// ============================================

const FACTORY_ABI = [
  {
    name: 'createToken',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'maxSupply', type: 'uint256' },
      { name: 'reserveToken', type: 'address' },
      { name: 'curveType', type: 'uint8' },
      { name: 'curveParams', type: 'bytes' },
      { name: 'mintRoyalty', type: 'uint16' },
      { name: 'burnRoyalty', type: 'uint16' },
    ],
    outputs: [{ name: 'token', type: 'address' }],
  },
];

const TOKEN_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'maxReserveAmount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'burn',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'minReserveAmount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'getCurrentPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'price', type: 'uint256' }],
  },
];

// ============================================
// DEPLOYMENT FUNCTIONS
// ============================================

async function deployToken() {
  console.log('🚀 HELM Token Deployment\n');
  console.log('===========================\n');
  
  // Validate environment
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ Error: DEPLOYER_PRIVATE_KEY not set in environment');
    console.log('   Create a .env file with: DEPLOYER_PRIVATE_KEY=0x...');
    process.exit(1);
  }
  
  // Setup wallet
  const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`);
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(process.env.BASE_RPC || 'https://mainnet.base.org'),
  });
  
  console.log(`📍 Deployer: ${account.address}`);
  console.log(`⛓️  Chain: Base Mainnet\n`);
  
  // Display configuration
  console.log('📋 Configuration:');
  console.log(`   Name: ${CONFIG.name}`);
  console.log(`   Symbol: ${CONFIG.symbol}`);
  console.log(`   Max Supply: ${(Number(CONFIG.maxSupply) / 10**18).toLocaleString()} HELM`);
  console.log(`   Reserve Token: ${CONFIG.reserveToken}`);
  console.log(`   Mint Royalty: ${CONFIG.mintRoyalty / 100}%`);
  console.log(`   Burn Royalty: ${CONFIG.burnRoyalty / 100}%`);
  console.log(`   Creator: ${CONFIG.creator || account.address}\n`);
  
  console.log('📈 Bonding Curve Steps:');
  CONFIG.curveSteps.forEach((step, i) => {
    const supply = Number(step.supply) / 10**18;
    const price = formatEther(step.price);
    console.log(`   Step ${i}: ${supply.toLocaleString()} HELM @ ${price} OPENWORK/HELM`);
  });
  console.log('');
  
  // Confirm deployment
  if (process.env.SKIP_CONFIRM !== 'true') {
    console.log('⚠️  Press Ctrl+C to cancel, waiting 5 seconds...\n');
    await new Promise(r => setTimeout(r, 5000));
  }
  
  try {
    // Encode stepped curve parameters
    // This is a simplified example - actual encoding depends on Mint Club's curve implementation
    const curveParams = encodeSteppedCurve(CONFIG.curveSteps);
    
    console.log('📤 Sending deployment transaction...\n');
    
    // Deploy token via Mint Club factory
    const hash = await walletClient.writeContract({
      address: MINT_CLUB_V2.factory,
      abi: FACTORY_ABI,
      functionName: 'createToken',
      args: [
        CONFIG.name,
        CONFIG.symbol,
        CONFIG.maxSupply,
        CONFIG.reserveToken,
        2, // Curve type: 2 = stepped linear (example)
        curveParams,
        CONFIG.mintRoyalty,
        CONFIG.burnRoyalty,
      ],
    });
    
    console.log(`⏳ Transaction sent: ${hash}`);
    console.log(`   Waiting for confirmation...\n`);
    
    // Wait for receipt (using ethers for convenience)
    const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC || 'https://mainnet.base.org');
    const receipt = await provider.waitForTransaction(hash);
    
    if (!receipt || receipt.status !== 1) {
      throw new Error('Transaction failed');
    }
    
    // Extract token address from event logs
    // This depends on Mint Club's event structure
    const tokenAddress = extractTokenAddress(receipt);
    
    console.log('✅ Token deployed successfully!\n');
    console.log('📊 Deployment Summary:');
    console.log(`   Token Address: ${tokenAddress}`);
    console.log(`   Transaction Hash: ${hash}`);
    console.log(`   Block Number: ${receipt.blockNumber}`);
    console.log(`   Gas Used: ${receipt.gasUsed?.toString()}\n`);
    
    // Save deployment info
    const deploymentInfo = {
      name: CONFIG.name,
      symbol: CONFIG.symbol,
      address: tokenAddress,
      deployer: account.address,
      transactionHash: hash,
      blockNumber: Number(receipt.blockNumber),
      chainId: 8453, // Base mainnet
      timestamp: new Date().toISOString(),
      config: {
        maxSupply: CONFIG.maxSupply.toString(),
        reserveToken: CONFIG.reserveToken,
        mintRoyalty: CONFIG.mintRoyalty,
        burnRoyalty: CONFIG.burnRoyalty,
      },
    };
    
    // Write to file
    const fs = await import('fs');
    fs.writeFileSync(
      './deployment-token.json',
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('💾 Deployment info saved to deployment-token.json\n');
    
    // Post-deployment instructions
    console.log('📝 Next Steps:');
    console.log('   1. Verify token on Basescan');
    console.log('   2. Add token to your wallet: ' + tokenAddress);
    console.log('   3. Update HELM_STAKING_ADDRESS in deploy-staking.js');
    console.log('   4. Deploy staking contract: node scripts/deploy-staking.js');
    console.log('   5. Announce on Moltbook!\n');
    
    return deploymentInfo;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Encode stepped curve parameters for Mint Club
 * Actual implementation depends on Mint Club's curve encoder
 */
function encodeSteppedCurve(steps) {
  // Simplified encoding - replace with actual Mint Club curve encoding
  // This is a placeholder - consult Mint Club docs for correct encoding
  const abiCoder = new ethers.AbiCoder();
  
  const supplyPoints = steps.map(s => s.supply);
  const pricePoints = steps.map(s => s.price);
  
  return abiCoder.encode(
    ['uint256[]', 'uint256[]'],
    [supplyPoints, pricePoints]
  );
}

/**
 * Extract token address from transaction receipt
 */
function extractTokenAddress(receipt) {
  // Placeholder - actual implementation depends on Mint Club's event structure
  // Look for TokenCreated event and extract the token address
  
  // For now, return a placeholder
  // In production, parse receipt.logs to find the TokenCreated event
  return '0x' + receipt.logs[0]?.topics[1]?.slice(-40) || 'UNKNOWN';
}

// ============================================
// BUY/SELL FUNCTIONS (Post-deployment)
// ============================================

/**
 * Buy HELM tokens using the bonding curve
 */
async function buyHelm(walletClient, tokenAddress, reserveAmount, minTokensOut) {
  console.log(`Buying HELM with ${formatEther(reserveAmount)} OPENWORK...`);
  
  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'mint',
    args: [minTokensOut, reserveAmount],
    value: 0n, // If reserve is ERC-20, value is 0
  });
  
  return hash;
}

/**
 * Sell HELM tokens using the bonding curve
 */
async function sellHelm(walletClient, tokenAddress, tokenAmount, minReserveOut) {
  console.log(`Selling ${formatEther(tokenAmount)} HELM...`);
  
  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: TOKEN_ABI,
    functionName: 'burn',
    args: [tokenAmount, minReserveOut],
  });
  
  return hash;
}

/**
 * Get current HELM price from bonding curve
 */
async function getHelmPrice(provider, tokenAddress) {
  const contract = new ethers.Contract(tokenAddress, TOKEN_ABI, provider);
  const price = await contract.getCurrentPrice();
  return price;
}

// ============================================
// MAIN EXECUTION
// ============================================

if (import.meta.url === `file://${process.argv[1]}`) {
  deployToken().catch(console.error);
}

export { deployToken, buyHelm, sellHelm, getHelmPrice };
