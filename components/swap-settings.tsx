'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface SwapSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slippage: number;
  onSlippageChange: (slippage: number) => void;
}

export function SwapSettings({
  open,
  onOpenChange,
  slippage,
  onSlippageChange,
}: SwapSettingsProps) {
  const [customSlippage, setCustomSlippage] = useState('');

  const handleSlippageChange = (value: number) => {
    setCustomSlippage('');
    onSlippageChange(value);
  };

  const handleCustomSlippageChange = (value: string) => {
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
      onSlippageChange(numValue);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Slippage Tolerance</label>
              <div className="mt-2 flex gap-2">
                <Button
                  variant={slippage === 0.1 ? "default" : "outline"}
                  onClick={() => handleSlippageChange(0.1)}
                >
                  0.1%
                </Button>
                <Button
                  variant={slippage === 0.5 ? "default" : "outline"}
                  onClick={() => handleSlippageChange(0.5)}
                >
                  0.5%x
                </Button>
                <Button
                  variant={slippage === 1.0 ? "default" : "outline"}
                  onClick={() => handleSlippageChange(1.0)}
                >
                  1.0%
                </Button>
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    placeholder="Custom"
                    value={customSlippage}
                    onChange={(e) => handleCustomSlippageChange(e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}