import { createPublicClient, http, formatEther } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http()
});

async function checkUserBalance() {
  const address = '0x12D0Bd7306Cd371CFb1A7a4Ea289F31FDD883099';
  const balance = await client.getBalance({ address });
  console.log(`User Balance: ${formatEther(balance)} ETH`);
}

checkUserBalance();
