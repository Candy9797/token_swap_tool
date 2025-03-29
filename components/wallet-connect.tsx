'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          variant="outline"
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <Button
          // disabled={!connector.ready}
          key={connector.id}
          onClick={() => {
            console.log(connector,'xl')
            connect({ connector });
            toast({
              title: 'Connecting wallet',
              description: 'Please approve the connection in your wallet.',
            });
          }}
        >
          Connect Wallet
          {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
        </Button>
      ))}
    </div>
  );
}