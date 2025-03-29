import { LiFi, Token as LiFiToken, Route } from '@lifi/sdk';

export const lifi = new LiFi({
  integrator: 'Custom Token Swap',
});

export interface Token extends LiFiToken {
  balance?: string;
}

export interface SwapRoute extends Route {
  gasCost: string;
}

export const getTokenBalance = async (
  token: Token,
  address: string
): Promise<string> => {
  try {
    const balance = await lifi.getTokenBalance({
      chainId: token.chainId,
      tokenAddress: token.address,
      walletAddress: address,
    });
    return balance.toString();
  } catch (error) {
    console.error('Failed to fetch token balance:', error);
    return '0';
  }
};