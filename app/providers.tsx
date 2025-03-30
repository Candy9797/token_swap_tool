"use client";
import { ChainType, EVM, config, createConfig, getChains } from '@lifi/sdk';
import { createConfig as createWagmiConfig, WagmiProvider } from "wagmi";
import type { Config, CreateConnectorFn } from 'wagmi';
import { ThemeProvider } from "next-themes";
import { createClient, http } from 'viem';
import { useSyncWagmiConfig } from '@lifi/wallet-management';
import { getWalletClient, switchChain } from '@wagmi/core';
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { mainnet } from 'viem/chains';
import { injected } from "wagmi/connectors";
const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
});
const chains = [mainnet] as const;

const connectors: CreateConnectorFn[] = [injected()];

// 4. 创建全局配置
export const wagmiConfig = createWagmiConfig({
  // 基础配置
  chains,
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
  // connectors,
  // transports,
});
createConfig({
  integrator: 'test',
  providers: [
    EVM({
      getWalletClient: () => getWalletClient(wagmiConfig),
      switchChain: async (chainId: number) => {
        const chain = await switchChain(wagmiConfig, { chainId: 1 });
        return getWalletClient(wagmiConfig, { chainId: chain.id });
      },
    }),
  ],
  // We disable chain preloading and will update chain configuration in runtime
  preloadChains: false,
});


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}> 
      <QueryClientProvider client={queryClient}>
      <ChainsLoader>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        </ChainsLoader>
      </QueryClientProvider>

    </WagmiProvider>
  );
}

function ChainsLoader({ children }: { children: React.ReactNode }) {
  // Load EVM chains from LI.FI API using getChains action from LI.FI SDK
  const { data: chains } = useQuery({
    queryKey: ['chains'] as const,
    queryFn: async () => {
      const chains = await getChains({
        chainTypes: [ChainType.EVM],
      });
      // Update chain configuration for LI.FI SDK
      config.setChains(chains);
      return chains;
    },
  });

  useSyncWagmiConfig(wagmiConfig, connectors, chains);

  return <>{children}</>;
}