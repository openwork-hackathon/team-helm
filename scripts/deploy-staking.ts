import { createWalletClient, http, publicActions, parseEther } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;

async function main() {
  if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY required');

  const account = privateKeyToAccount(PRIVATE_KEY);
  const client = createWalletClient({
    account,
    chain: base,
    transport: http()
  }).extend(publicActions);

  // Load artifact
  const artifactPath = path.resolve(__dirname, '../contracts/HELMStaking.json');
  if (!fs.existsSync(artifactPath)) {
    throw new Error('HELMStaking.json not found. Run compile.cjs first.');
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  // Get HELM Token Address (Passed as arg or hardcoded placeholder)
  const helmTokenAddress = process.argv[2];
  if (!helmTokenAddress) {
    console.error('Usage: npx ts-node scripts/deploy-staking.ts <HELM_TOKEN_ADDRESS>');
    process.exit(1);
  }

  console.log(`Deploying HELMStaking with token: ${helmTokenAddress}`);
  console.log(`Deployer: ${account.address}`);

  const hash = await client.deployContract({
    abi: artifact.abi,
    bytecode: artifact.evm.bytecode.object,
    args: [helmTokenAddress]
  });

  console.log(`Transaction Hash: ${hash}`);
  
  const receipt = await client.waitForTransactionReceipt({ hash });
  console.log(`✅ HELMStaking deployed at: ${receipt.contractAddress}`);
}

main().catch(console.error);
