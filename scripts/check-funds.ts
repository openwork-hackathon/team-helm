import { createPublicClient, http, formatEther } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http()
});

async function checkBalance() {
  const address = '0x1b041f48c392E7cB3346c5dFd1f9779f5D21CD4b';
  const balance = await client.getBalance({ address });
  console.log(`Balance: ${formatEther(balance)} ETH`);
  
  if (balance >= 2000000000000000n) { // 0.002 ETH
    console.log('✅ Funds received!');
    process.exit(0);
  } else {
    console.log('❌ Waiting for funds...');
    process.exit(1);
  }
}

checkBalance();
