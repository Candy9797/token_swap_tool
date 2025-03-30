"use client";
import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";

export function SwitchChain() {
  const { address, isConnected } = useAccount();
  const { chains, switchChain } = useSwitchChain();
  console.log(address, "xluseAccount()");

  return isConnected ? (
    <div className="container mx-auto pt-16">
      <h1 className="text-2xl font-bold mb-4">Chain Switcher</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chains.map((chain) => (
          <Button
            key={chain.id}
            variant={'outline'}
            onClick={() => switchChain({ chainId: chain.id })}
          >
            {chain.name}
          </Button>
        ))}
      </div>
    </div>
  ): null;
}
