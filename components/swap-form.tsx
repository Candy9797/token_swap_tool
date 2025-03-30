"use client";
import { useState, useEffect } from "react";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowDownUp, Loader2, Settings, Info } from "lucide-react";
import { TokenSelectDialog } from "./token-select-dialog";
import { SwapSettings } from "./swap-settings";
import { Token, SwapRoute, getLifiTokenBalance } from "@/lib/lifi";
import { useToast } from "@/hooks/use-toast";
import { formatUnits, parseUnits } from "ethers";
import { ChainKey, executeRoute, getRoutes, getTokens } from "@lifi/sdk";

export function SwapForm() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const { toast } = useToast();
  const [tokens, setTokens] = useState<Record<number, Token[]>>([]);
  const [fromToken, setFromToken] = useState<Token>();
  const [toToken, setToToken] = useState<Token>();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<SwapRoute>();
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [fromBalance, setFromBalance] = useState("0");
  const [toBalance, setToBalance] = useState("0");
   const { chains, switchChain } = useSwitchChain();
  console.log(balance, address, chain, "xl999----");

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokenResponse = await getTokens({
          chains: [ChainKey.ETH, ChainKey.BSC],
        });
        // const allTokens = Object.values(tokenResponse.tokens).flat();
        const allTokens = tokenResponse.tokens;
        setTokens(allTokens);
        console.log("tokenResponse", allTokens, tokenResponse);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available tokens",
          variant: "destructive",
        });
      }
    };
    fetchTokens();
  }, []);

  useEffect(() => {
    const updateBalances = async () => {
      if (!address) return;

      if (fromToken) {
        const balance = await getLifiTokenBalance(fromToken, address);
        console.log(balance, fromToken, address, "xlxlbalance");

        setFromBalance(balance);
      }

      if (toToken) {
        const balance = await getLifiTokenBalance(toToken, address);
        setToBalance(balance);
      }
    };

    updateBalances();
  }, [address, fromToken, toToken]);

  useEffect(() => {
    const getRoute = async () => {
      if (
        !fromToken ||
        !toToken ||
        !amount ||
        !address ||
        Number(amount) <= 0
      ) {
        setRoute(undefined);
        return;
      }

      setLoading(true);
      try {
        const fromAmount = fromToken
          ? parseUnits(amount, fromToken.decimals).toString()
          : {};
        const routeRequest = {
          fromChainId: fromToken?.chainId ?? 0,
          fromTokenAddress: fromToken?.address,
          fromAmount,
          fromAddress: address,
          toChainId: toToken?.chainId,
          toTokenAddress: toToken?.address,
          slippage: slippage / 100,
          options: {
            integrator: "Custom_Token_Swap",
            referrer: address,
          },
        };

        const routeResponse = await getRoutes(routeRequest as any);

        if (routeResponse.routes.length > 0) {
          setRoute(routeResponse.routes[0] as SwapRoute);
        } else {
          setRoute(undefined);
          toast({
            title: "No Route Found",
            description: "Could not find a valid swap route for these tokens",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to get route:", error);
        toast({
          title: "Error",
          description: "Failed to find a swap route",
          variant: "destructive",
        });
        setRoute(undefined);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(getRoute, 500);
    return () => clearTimeout(debounce);
  }, [fromToken, toToken, amount, address, slippage, toast]);

  const handleSwap = async () => {
    console.log(chain?.id ,fromToken?.chainId, "=======");
    if (!route || !address) return;

    try {
      if (chain?.id !== fromToken?.chainId) {
        // 使用 wagmi 的 switchNetwork 方法切换链
        await switchChain({ chainId: chain?.id || 1 });
      } else {
        // throw new Error("Switch network function is not available");
      }
      // const balance = await getLifiTokenBalance(
      //   signer,
      //   route.fromToken.address
      // );
      // if (balance.lt(route.fromAmount)) {
      //   throw new Error('余额不足');
      // }
      console.log("Swap result:", balance, route, executeRoute);

      setLoading(true);
      const result = await executeRoute(route);
      console.log("Swap result2:", result);

      toast({
        title: "Success",
        description: "Swap executed successfully",
      });

      // Reset form
      setAmount('');
      setRoute(undefined);
    } catch (error) {
      console.error("Swap failed:", error);
      toast({
        title: "Error",
        description: "Failed to execute swap",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value: string, decimals: number) => {
    try {
      return formatUnits(value, decimals);
    } catch {
      return "0";
    }
  };

  const formatBalance = (balance: string, token?: Token) => {
    if (!token || !balance) return "0";
    try {
      return Number(formatUnits(balance, token.decimals)).toFixed(4);
    } catch (error) {
      console.error("Failed to format balance:", error);
      return "0";
    }
  };

  return (
    <Card className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Swap</h2>
        Current Chain: {chain?.name}-{chain?.id}
        <Button size="icon" onClick={() => setShowSettings(true)}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">From</label>
            {fromToken && (
              <span className="text-sm text-muted-foreground">
               Balance: {formatBalance(fromBalance, fromToken)}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              className="flex-1"
            />
            <TokenSelectDialog
              tokens={tokens}
              onSelect={setFromToken}
              selectedToken={fromToken}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => {
              const temp = fromToken;
              setFromToken(toToken);
              setToToken(temp);
              setAmount("");
              setRoute(undefined);
            }}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">To</label>
            {toToken && (
              <span className="text-sm text-muted-foreground">
                Balance: {formatBalance(toBalance, toToken)}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={
                route
                  ? formatAmount(route.toAmount, toToken?.decimals || 18)
                  : ""
              }
              disabled
              className="flex-1"
            />
            <TokenSelectDialog
              tokens={tokens}
              onSelect={setToToken}
              selectedToken={toToken}
            />
          </div>
        </div>
      </div>

      {route && (
        <div className="mt-6 space-y-2 text-sm bg-secondary/50 rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span>
              1 {fromToken?.symbol} ={" "}
              {(
                Number(formatAmount(route.toAmount, toToken?.decimals || 18)) /
                Number(amount)
              ).toFixed(6)}{" "}
              {toToken?.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Route</span>
            <div className="flex items-center gap-2">
              <span>{route.steps.length} steps</span>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gas Cost</span>
            <span>${route.gasCostUSD}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Slippage Tolerance</span>
            <span>{slippage}%</span>
          </div>
        </div>
      )}

      <Button
        className="w-full mt-6"
        disabled={!route || loading || !amount || Number(amount) <= 0}
        onClick={handleSwap}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {route ? "Swapping..." : "Finding best route..."}
          </>
        ) : !fromToken || !toToken ? (
          "Select tokens"
        ) : !amount || Number(amount) <= 0 ? (
          "Enter amount"
        ) : !route ? (
          "No route found"
        ) : chain?.id !== fromToken?.chainId ? (
          `Switch to ${
            fromToken.chainId === 1 ? "Ethereum" : `Chain ${fromToken.chainId}`
          }`
        ) : (
          "Swap"
        )}
      </Button>

      <SwapSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        slippage={slippage}
        onSlippageChange={setSlippage}
      />
    </Card>
  );
}
