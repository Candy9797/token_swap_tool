import {  getTokenBalance, Token as LiFiToken, Route } from '@lifi/sdk';

export interface Token extends LiFiToken {
  balance?: string;
}

export interface SwapRoute extends Route {
  gasCost: string;
}

export const getLifiTokenBalance = async (
  token: Token,
  address: string
): Promise<string> => {
  try {
    const balance = await getTokenBalance(address, token);
    console.log(balance,'xlxlbalance')
    return balance?.amount?.toString() || '';
  } catch (error) {
    console.error('Failed to fetch token balance:', error);
    return '0';
  }
};