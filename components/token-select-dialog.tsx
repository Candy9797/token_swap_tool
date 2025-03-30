"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import Image from "next/image";
import { Token } from "@/lib/lifi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
const chainMap: Record<string, string> = {
  ["1"]: 'Ethereum',
  ['56']:"BSC"
}
interface TokenSelectDialogProps {
  tokens: Record<number,Token[]>;
  onSelect: (token: Token) => void;
  selectedToken?: Token;
}

export function TokenSelectDialog({
  tokens = {},
  onSelect,
  selectedToken,
}: TokenSelectDialogProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [chain, setChain] = useState<number>(1)

  const filteredTokens = (tokens[chain] || []).filter(
    (token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (token: Token) => {
    onSelect(token);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {selectedToken ? (
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80">
            {selectedToken.logoURI && (
              <Image
                src={selectedToken.logoURI}
                alt={selectedToken.symbol}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="font-medium">{selectedToken.symbol}</span>
          </button>
        ) : (
          <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90">
            Select Token
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Select a token from {filteredTokens?.length}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={"1"} className="w-full">
          <TabsList className="mb-4">
            {Object.keys(tokens).map((item: any) => (
              <TabsTrigger key={item} value={item} onClick={()=>{
                setChain(item)
              }}>
                {chainMap[String(item)]}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Tab Content */}
          {filteredTokens.map((item:any) => (
            <TabsContent key={item.id} value={`tab${item.id}`}>
              <p>{item.content}</p>
            </TabsContent>
          ))}
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or symbol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {filteredTokens.map((token) => (
              <button
                key={`${token.chainId}-${token.address}`}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                onClick={() => handleSelect(token)}
              >
                {token.logoURI && (
                  <Image
                    src={token.logoURI}
                    alt={token.symbol}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div className="text-left">
                  <div className="font-medium">{token.symbol} </div>
                  <div className="text-sm text-muted-foreground">
                    {token.name}- Price: ${token.priceUSD}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
