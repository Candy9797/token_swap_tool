"use client";
import { useEffect, useState } from "react";
import { WalletConnect } from "@/components/wallet-connect";
import { SwapForm } from "@/components/swap-form";
import { useSwitchChain } from "wagmi";
import { SwitchChain } from "@/components/switch-chain";

export default function Home() {
  const { chains, switchChain } = useSwitchChain();
  const [isClient, setIsClient] = useState(false);
  // 确保组件只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Token Swap</h1>
          <WalletConnect />
        </div>
        <SwapForm />
        <SwitchChain/>
      </div>
    </div>
  );
}
