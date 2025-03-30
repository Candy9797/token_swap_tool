"use client";
import {
  injected,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { Button } from "@/components/ui/button";

export function WalletConnect() {
  const { chains, switchChain } = useSwitchChain();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div>
        <div className="text-sm text-muted-foreground">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <Button variant="outline" onClick={() => disconnect()}>
          Disconnect
        </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
       <div>
      {connectors.map((connector: { id: string; name: string }) => (
        <Button
          style={{ margin: "12px 12px 12px 0" }}
          key={connector.id}
          onClick={() => {
            console.log(connect, connector, "xlconnector");
            connect({
              connector: injected(),
            });
          }}
        >
          Connect with {connector.name}
        </Button>
      ))}
      </div>
    </div>
  );
}
