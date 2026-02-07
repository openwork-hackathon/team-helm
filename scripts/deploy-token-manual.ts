import { createWalletClient, createPublicClient, http, publicActions, parseEther } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from 'dotenv';
// Import ABI from SDK or define minimal ABI
// Bond Contract on Base: 0xc5a076cad94176c2996B32d8466Be1cE757FAa27
dotenv.config();

const BOND_ADDRESS = '0xc5a076cad94176c2996B32d8466Be1cE757FAa27';
const OPENWORK_TOKEN = '0x299c30DD5974BF4D5bFE42C340CA40462816AB07';
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;

const ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'name', type: 'string' },
          { name: 'symbol', type: 'string' }
        ],
        name: 'tokenParams',
        type: 'tuple'
      },
      {
        components: [
          { name: 'mintRoyalty', type: 'uint256' },
          { name: 'burnRoyalty', type: 'uint256' },
          { name: 'reserveToken', type: 'address' },
          { name: 'maxSupply', type: 'uint256' },
          { name: 'stepRanges', type: 'uint256[]' },
          { name: 'stepPrices', type: 'uint256[]' }
        ],
        name: 'bondParams',
        type: 'tuple'
      }
    ],
    name: 'createToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

const ABI_FEE = [
  { inputs: [], name: 'creationFee', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }
];

async function main() {
  const account = privateKeyToAccount(PRIVATE_KEY);
  const publicClient = createPublicClient({ chain: base, transport: http() });
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http()
  }).extend(publicActions);

  console.log(`Deploying from ${account.address}`);
  
  // Get Creation Fee
  const creationFee = await publicClient.readContract({
    address: BOND_ADDRESS,
    abi: ABI_FEE,
    functionName: 'creationFee'
  });
  console.log(`Creation Fee: ${creationFee} wei`);

  const maxSupply = 10_000_000n * 10n**18n;
  
  try {
    const hash = await walletClient.writeContract({
      address: BOND_ADDRESS,
      abi: ABI,
      functionName: 'createToken',
      args: [
        { name: 'HELM Token', symbol: 'HELM' },
        {
          mintRoyalty: 30, // Try 0.03% (30 bps?) or 3? Let's use 30.
          burnRoyalty: 30,
          reserveToken: OPENWORK_TOKEN,
          maxSupply: maxSupply,
          stepRanges: [maxSupply],
          stepPrices: [2000000000000000n] // 0.002 OPENWORK fixed
        }
      ],
      value: creationFee
    });

    console.log('Tx Hash:', hash);
    const receipt = await client.waitForTransactionReceipt({ hash });
    console.log('Success!');
  } catch (error) {
    console.error(error);
  }
}

main();
