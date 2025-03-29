'use client';

import { WalletConnect } from '@/components/wallet-connect';
import { SwapForm } from '@/components/swap-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Token Swap</h1>
          <WalletConnect />
        </div>
        
        <div className="max-w-xl mx-auto">
          <SwapForm />
        </div>
      </div>
    </main>
  );
}