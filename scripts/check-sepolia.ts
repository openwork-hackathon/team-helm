import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';

const client = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

async function checkBalance() {
  const address = '0x1b041f48c392E7cB3346c5dFd1f9779f5D21CD4b';
  const balance = await client.getBalance({ address });
  console.log(`Sepolia Balance: ${formatEther(balance)} ETH`);
}

checkBalance();
