/**
 * HELM Staking Contract Deployment Script
 * 
 * Deploys the HELMStaking.sol contract for tier-based feature access
 * 
 * Prerequisites:
 * - HELM token already deployed
 * - Environment variables set
 * 
 * Usage:
 *   node scripts/deploy-staking.js
 */

import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { ethers } from 'ethers';
import fs from 'fs';

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // HELM token address (from previous deployment)
  helmToken: process.env.HELM_TOKEN_ADDRESS || null,
  
  // If null, will try to read from deployment-token.json
};

// ============================================
// CONTRACT ABI & BYTECODE (from compilation)
// ============================================

// Simplified ABI - full ABI generated from compilation
const STAKING_ABI = [
  {
    inputs: [{ name: '_helmToken', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    name: 'stake',
    inputs: [{ name: '_amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    name: 'unstake',
    inputs: [{ name: '_amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    name: 'unstakeAll',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    name: 'getStake',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    name: 'getTier',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    name: 'hasTier',
    inputs: [
      { name: '_user', type: 'address' },
      { name: '_minTier', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    name: 'getTierName',
    inputs: [{ name: '_tier', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    name: 'totalStaked',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// ============================================
// DEPLOYMENT FUNCTION
// ============================================

async function deployStaking() {
  console.log('🚀 HELM Staking Contract Deployment\n');
  console.log('====================================\n');
  
  // Validate environment
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ Error: DEPLOYER_PRIVATE_KEY not set');
    process.exit(1);
  }
  
  // Get HELM token address
  let helmTokenAddress = CONFIG.helmToken;
  
  if (!helmTokenAddress && fs.existsSync('./deployment-token.json')) {
    const tokenDeployment = JSON.parse(fs.readFileSync('./deployment-token.json', 'utf8'));
    helmTokenAddress = tokenDeployment.address;
    console.log(`📋 Found HELM token from deployment-token.json: ${helmTokenAddress}`);
  }
  
  if (!helmTokenAddress) {
    console.error('❌ Error: HELM_TOKEN_ADDRESS not set and deployment-token.json not found');
    console.log('   Run deploy-token.js first or set HELM_TOKEN_ADDRESS');
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
  console.log(`🪙 HELM Token: ${helmTokenAddress}`);
  console.log(`⛓️  Chain: Base Mainnet\n`);
  
  console.log('📋 Tier Configuration:');
  console.log('   Tier 0 (Free): 0 HELM staked');
  console.log('   Tier 1 (HELM): 1,000 HELM staked');
  console.log('   Tier 2 (Navigator): 10,000 HELM staked');
  console.log('   Tier 3 (Fleet): 100,000 HELM staked\n');
  
  // Confirm deployment
  if (process.env.SKIP_CONFIRM !== 'true') {
    console.log('⚠️  Press Ctrl+C to cancel, waiting 3 seconds...\n');
    await new Promise(r => setTimeout(r, 3000));
  }
  
  try {
    console.log('📤 Deploying staking contract...\n');
    
    // Deploy using ethers for simplicity with bytecode
    const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC || 'https://mainnet.base.org');
    const wallet = new ethers.Wallet(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`, provider);
    
    // Load compiled contract
    // In production, compile with: solc contracts/HELMStaking.sol
    // For now, using placeholder - actual deployment requires compiled bytecode
    
    console.log('⚠️  Note: This script requires compiled contract bytecode.');
    console.log('   Compile with: solc --bin contracts/HELMStaking.sol\n');
    
    // Placeholder for actual deployment
    // Replace with actual bytecode from compilation
    const STAKING_BYTECODE = '0x...'; // From solc compilation
    
    const StakingFactory = new ethers.ContractFactory(STAKING_ABI, STAKING_BYTECODE, wallet);
    const staking = await StakingFactory.deploy(helmTokenAddress);
    
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();
    
    console.log('✅ Staking contract deployed!\n');
    console.log('📊 Deployment Summary:');
    console.log(`   Staking Address: ${stakingAddress}`);
    console.log(`   HELM Token: ${helmTokenAddress}`);
    console.log(`   Deployer: ${account.address}\n`);
    
    // Save deployment info
    const deploymentInfo = {
      name: 'HELMStaking',
      address: stakingAddress,
      helmToken: helmTokenAddress,
      deployer: account.address,
      transactionHash: staking.deploymentTransaction()?.hash,
      chainId: 8453,
      timestamp: new Date().toISOString(),
      tiers: {
        free: 0,
        helm: 1000,
        navigator: 10000,
        fleet: 100000,
      },
    };
    
    fs.writeFileSync('./deployment-staking.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('💾 Deployment info saved to deployment-staking.json\n');
    
    // Post-deployment instructions
    console.log('📝 Next Steps:');
    console.log('   1. Verify contract on Basescan');
    console.log('   2. Approve staking contract to spend HELM (for testing)');
    console.log('   3. Test stake() and unstake() functions');
    console.log('   4. Update .env with:');
    console.log(`      HELM_STAKING_ADDRESS=${stakingAddress}`);
    console.log('   5. Integrate tier checks into HELM app\n');
    
    // Generate .env snippet
    console.log('📋 Add to your .env file:');
    console.log(`   HELM_TOKEN_ADDRESS=${helmTokenAddress}`);
    console.log(`   HELM_STAKING_ADDRESS=${stakingAddress}\n`);
    
    return deploymentInfo;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// ============================================
// STAKING INTERACTION FUNCTIONS
// ============================================

/**
 * Stake HELM tokens to unlock tier
 */
async function stakeHelm(wallet, stakingAddress, amount) {
  const staking = new ethers.Contract(stakingAddress, STAKING_ABI, wallet);
  
  console.log(`Staking ${ethers.formatEther(amount)} HELM...`);
  const tx = await staking.stake(amount);
  await tx.wait();
  console.log('✅ Staked successfully');
  
  return tx.hash;
}

/**
 * Unstake HELM tokens
 */
async function unstakeHelm(wallet, stakingAddress, amount) {
  const staking = new ethers.Contract(stakingAddress, STAKING_ABI, wallet);
  
  console.log(`Unstaking ${ethers.formatEther(amount)} HELM...`);
  const tx = await staking.unstake(amount);
  await tx.wait();
  console.log('✅ Unstaked successfully');
  
  return tx.hash;
}

/**
 * Check user's tier
 */
async function getUserTier(provider, stakingAddress, userAddress) {
  const staking = new ethers.Contract(stakingAddress, STAKING_ABI, provider);
  
  const tier = await staking.getTier(userAddress);
  const tierName = await staking.getTierName(tier);
  const stakedAmount = await staking.getStake(userAddress);
  
  return {
    tier: Number(tier),
    tierName,
    stakedAmount: ethers.formatEther(stakedAmount),
  };
}

// ============================================
// MAIN EXECUTION
// ============================================

if (import.meta.url === `file://${process.argv[1]}`) {
  deployStaking().catch(console.error);
}

export { deployStaking, stakeHelm, unstakeHelm, getUserTier };
