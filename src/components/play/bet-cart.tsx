import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { formatCurrency } from '@/lib/utils';
import type { BetList, Game } from '@/types/game';

import { useDirection } from '@radix-ui/react-direction';
import { Image } from '@unpic/react';
import { LoaderCircleIcon, X } from 'lucide-react';

interface BetCartProps {
  betLists: BetList[]
  children: React.ReactNode
  onRemoveItem: (index: number) => void
  onClearCart: () => void
  handlePlaceBet: () => void
  loading: boolean
  selectedGame: Game | null
}

export const BetCart = ({
                          children,
                          betLists,
                          onRemoveItem,
                          onClearCart,
                          handlePlaceBet,
                          loading,
                          selectedGame
                        }: BetCartProps) => {
  const direction = useDirection();

  const totalStake = betLists.reduce((total, bet) => total + bet.stake, 0);

  // Helper function to display balls (Following Vue logic)
  const renderBetBalls = (bet: BetList) => {
    const code = bet.betType.code.toUpperCase();
    const nap = bet.betType.nap;

    // 1. BANKER BET
    if (code === 'BANKER') {
      // For Banker: Display the banker ball(s) and indicate AG 1-90
      return (
        <>
          <div className="text-sm text-slate-500 mt-1">
            <span className="font-semibold">Balls:</span>
            <span className="ml-2 font-semibold text-slate-700">
              {bet.selectedBalls.join(', ')} <span className="font-bold">AG 1-90</span>
            </span>
          </div>
        </>
      );
    }

    // 2. AGAINST SINGLES (AGS) BET
    if (nap === 'AGS') {
      // For Against Singles: Display Main Bets and Against Bets
      return (
        <>
          <div className="text-sm text-slate-500 mt-1">
            <span className="font-semibold">Main Bets:</span>
            <span className="ml-2 font-semibold text-slate-700">
              {bet.selectedBalls.length > 0 ? bet.selectedBalls.join(', ') : '—'}
            </span>
          </div>
          <div className="text-sm text-slate-500 mt-1">
            <span className="font-semibold">AG:</span>
            <span className="ml-2 font-semibold text-slate-700">
              {bet.againstBalls.length > 0 ? bet.againstBalls.join(', ') : '—'}
            </span>
          </div>
        </>
      );
    }

    // 3. DIRECT/PERM BET (Default)
    // For Direct/Perm: Display only selectedBalls
    return (
      <div className="text-sm text-slate-500 mt-1">
        <span className="font-semibold">My Bets:</span>
        <span className="ml-2 font-semibold text-slate-700">
          {bet.selectedBalls.length > 0 ? bet.selectedBalls.join(', ') : '—'}
        </span>
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="p-0" dir={direction}>
        <SheetHeader className="py-4 px-5 border-b border-border">
          <SheetTitle>My Bet Cart ({betLists.length})</SheetTitle>
        </SheetHeader>
        <SheetBody className="py-0 px-5 grow">
          <ScrollArea className="text-sm h-[calc(100dvh-280px)] pe-3 -me-3">
            <div className="bg-background">
              {betLists && betLists.length > 0 ? (
                betLists.map((bet, index) => (
                  <div key={index}>
                    <div className="grid md:grid-cols-3 items-center md:gap-4 gap-4 py-4">
                      <div className="col-span-2 flex items-center gap-6">
                        <div className="w-10 h-10 shrink-0">
                          <Image
                            src={'/game-1.png'}
                            alt={'game-1'}
                            width={38}
                            height={38}
                            className="rounded object-fill"
                          />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-semibold text-slate-900">
                            {selectedGame?.gameName}
                          </h3>
                          <div className="text-sm text-slate-500 mt-1">
                            <span className="font-semibold">Type:</span>
                            <span className="ml-2 font-semibold text-slate-700">
                              {bet.betType.code}
                            </span>
                          </div>

                          {/* Render bet balls using helper function */}
                          {renderBetBalls(bet)}

                          <div className="text-sm text-slate-500 mt-1">
                            <span className="font-semibold">Max. Win:</span>
                            <span className="ml-2 font-semibold text-slate-700">
                              {formatCurrency(bet.maxWinning)}
                            </span>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            <span className="font-semibold">No. of Lines:</span>
                            <span className="ml-2 font-semibold text-slate-700">
                              {bet.numberOfLines}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <h4 className="text-[15px] font-semibold text-slate-900">
                          {formatCurrency(Number(bet.stake))}
                        </h4>
                        <Button
                          onClick={() => onRemoveItem(index)}
                          variant="dim"
                          mode="icon"
                          className="ms-auto text-red-500 ml-4"
                          aria-label="Remove item"
                        >
                          <X />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-500">
                  Your bet cart is empty.
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetBody>
        <SheetFooter className="py-6 px-5 border-t border-border flex flex-col justify-between gap-6">
          <div className="bg-gradient-to-b w-full from-[#01B1A8] to-[#0185B6] overflow-hidden rounded-sm p-6">
            <ul className="text-background font-medium divide-y divide-gray-300">
              <li className="flex flex-wrap gap-4 text-sm">
                Subtotal
                <span className="ml-auto font-semibold text-background">
                  {formatCurrency(totalStake)}
                </span>
              </li>
            </ul>
          </div>
          <div className="flex flex-row gap-4 justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={onClearCart}
              className="w-full text-[#0185B6] rounded-full hover:opacity-80"
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={handlePlaceBet}
              disabled={loading || betLists.length === 0}
              className="w-full bg-[#0185B6] text-background rounded-full hover:opacity-80"
            >
              {loading ? <LoaderCircleIcon className="animate-spin size-4" /> : null}
              {loading ? 'Placing Bet...' : 'Place Bet'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}