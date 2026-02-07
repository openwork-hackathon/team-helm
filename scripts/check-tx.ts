import { createPublicClient, http } from 'viem';
import { base, mainnet } from 'viem/chains';

const baseClient = createPublicClient({ chain: base, transport: http() });
const ethClient = createPublicClient({ chain: mainnet, transport: http() });

const TX_HASH = '0xf2f77043771659ec43ffe0890a3d1a6851ebf95f462117a1b28601390f6de5f8';

async function checkTx() {
  console.log('Checking Base...');
  try {
    const tx = await baseClient.getTransaction({ hash: TX_HASH });
    console.log('✅ Found on BASE!');
    console.log('Value:', tx.value.toString());
    process.exit(0);
  } catch (e) { console.log('Not on Base.'); }

  console.log('Checking Ethereum Mainnet...');
  try {
    const tx = await ethClient.getTransaction({ hash: TX_HASH });
    console.log('⚠️ Found on ETHEREUM MAINNET!');
    console.log('Value:', tx.value.toString());
    process.exit(0);
  } catch (e) { console.log('Not on Ethereum Mainnet.'); }
  
  console.log('❌ Transaction not found on Base or Mainnet.');
}

checkTx();
