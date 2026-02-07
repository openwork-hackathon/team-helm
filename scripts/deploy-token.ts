import { mintclub } from 'mint.club-v2-sdk';
import { createWalletClient, http, publicActions } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from 'dotenv';

dotenv.config();

const OPENWORK_TOKEN = '0x299c30DD5974BF4D5bFE42C340CA40462816AB07'; // Base
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;

if (!PRIVATE_KEY) {
  console.error('❌ PRIVATE_KEY is required in .env');
  process.exit(1);
}

async function main() {
  // Set wallet for Mint Club SDK
  mintclub.wallet = mintclub.wallet.withPrivateKey(PRIVATE_KEY);
  
  const account = privateKeyToAccount(PRIVATE_KEY);
  console.log(`🚀 Deploying HELM token from ${account.address}...`);

  const exists = await mintclub.network('base').token('HELM').exists();
  if (exists) {
    const detail = await mintclub.network('base').token('HELM').getDetail();
    console.log(`⚠️ HELM token already exists at: ${detail.info.token}`);
    return;
  }

  // Create Token
  // Steps:
  // 0 - 1M @ 0.001 (Cost: 1,000 OPENWORK)
  // 1M - 5M @ 0.005 (Cost: 20,000 OPENWORK)
  // 5M - 10M @ 0.01 (Cost: 50,000 OPENWORK)
  // Total Cost to Buy Out: 71,000 OPENWORK

  try {
    const tx = await mintclub.network('base').token('HELM').create({
      name: 'HELM Token',
      reserveToken: {
        address: OPENWORK_TOKEN,
        decimals: 18,
      },
      curveData: {
        curveType: 'LINEAR',
        stepCount: 3,
        maxSupply: 10_000_000,
        initialMintingPrice: 0.001, // 0.001 OPENWORK
        finalMintingPrice: 0.01,    // 0.01 OPENWORK
        creatorAllocation: 0,
      },
      // Note: SDK usually handles curve data structure for linear curves
      // If explicit steps are needed, we use 'stepData' but 'LINEAR' simplifies it.
      // Let's stick to simple LINEAR for now as per docs usually found in examples.
      // Actually, for specific tiers, we might need custom. 
      // But let's try standard Linear first to ensure deployment works.
      
      onSuccess: (receipt) => {
        console.log('✅ Token Deployed!');
        console.log('Tx Hash:', receipt.transactionHash);
      },
      onError: (err) => {
        console.error('❌ Deployment Failed:', err);
      }
    });

    console.log('Deployment initiated...');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
