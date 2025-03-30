"use client";
import { createConfig, http, WagmiProvider } from "wagmi";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, polygon, arbitrum, base } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";
const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
});
// 1. 定义支持的链列表
const chains = [mainnet, polygon, arbitrum, base] as const;

// 2. 定义连接器列表
const connectors = [
  injected({}),
  walletConnect({
    projectId: "60b2ccbbc22b78540774d35037c604ba",
  }),
  coinbaseWallet({
    appName: "Token Swap",
  }),
] as const;

// 3. 定义 RPC 传输配置，Wagmi 本身具备默认的 RPC 配置，在开发和测试的初期阶段，如果仅进行简单的功能验证，默认配置就能满足需求
// 但定义自定义的 RPC 传输配置可以增强应用的安全性。公共 RPC 节点可能存在安全风险，如数据泄露、恶意攻击等。通过使用自定义的 RPC 端点，可以更好地控制数据的传输和访问，采取必要的安全措施，如加密传输、访问控制等，保护用户的隐私和资产安全
const transports = {
  [mainnet.id]: http(),
  [base.id]: http(),
  [polygon.id]: http(),
  [arbitrum.id]: http(),
  // [sepolia.id]: http(),
};

// 4. 创建全局配置
export const config = createConfig({
  // 基础配置
  chains,
  connectors,
  transports,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
