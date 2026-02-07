'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { parseEther } from 'viem';

// HELM Token Address (Placeholder until deployed)
const HELM_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'; 
const STAKING_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Deploy this next

export default function StakingPage() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');

  // TODO: Implement Staking logic once contracts are deployed
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Staking Tiers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TierCard 
          title="Free" 
          price="0 HELM" 
          features={['3 active threads', 'Weekly prompts']}
          active={true}
        />
        <TierCard 
          title="HELM" 
          price="1,000 HELM" 
          features={['Unlimited threads', 'Daily prompts', 'Pattern detection']}
        />
        <TierCard 
          title="Navigator" 
          price="10,000 HELM" 
          features={['Multi-agent', 'Custom integrations', 'Priority support']}
        />
      </div>

      <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Stake HELM</h2>
        {isConnected ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Contract not yet deployed. Check back soon!
            </p>
            {/* 
            <input 
              type="number" 
              placeholder="Amount to stake"
              className="border p-2 rounded"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Stake
            </button> 
            */}
          </div>
        ) : (
          <p className="text-gray-500">Connect wallet to stake.</p>
        )}
      </div>
    </div>
  );
}

function TierCard({ title, price, features, active }: any) {
  return (
    <div className={`p-6 rounded-lg border-2 ${active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-2xl font-bold text-gray-800 mb-4">{price}</div>
      <ul className="space-y-2 text-sm text-gray-600">
        {features.map((f: string, i: number) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>
      {active && (
        <div className="mt-4 text-center text-blue-600 font-bold text-sm">
          Current Tier
        </div>
      )}
    </div>
  );
}
