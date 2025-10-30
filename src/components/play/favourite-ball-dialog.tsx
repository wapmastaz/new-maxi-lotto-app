import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Ball from "@/components/ball"

interface FavouriteBallDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  favoriteBalls: number[],
  selectBall: (ball: number) => void
  bankerBalls: number[],
  againstBalls: number[],
  normalBalls: number[],
}

export function FavouriteBallDialog({ open, setOpen, favoriteBalls, selectBall, bankerBalls, againstBalls, normalBalls }: FavouriteBallDialogProps) {


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:mx-auto max-w-[95%] sm:max-w-xl mx-auto bg-gradient-to-b from-[#01B1A8] to-[#0185B6] p-4 rounded">
        <DialogHeader className="text-center">
          <DialogTitle className="font-semibold text-white">Select Favourite Balls</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-sm">
          {/* Ball grid */}
          <ScrollArea className="h-[45vh] w-full ">
            <div className="flex flex-wrap gap-4 rounded-2xl p-2">
              {favoriteBalls.map((ball: number) => {
                const isBanker = bankerBalls.includes(ball)
                const isAgainst = againstBalls.includes(ball)
                const isNormalSelected = normalBalls.includes(ball)

                return (<Ball
                  key={ball}
                  value={ball}
                  // A ball is "selected" if it's in any of the three lists
                  isSelected={isBanker || isAgainst || isNormalSelected}
                  // Apply different styling based on its role
                  className={

                    isBanker ? 'bg-[#FFF100] text-[#0A4B7F] border-2 border-red-500' :
                      isAgainst ? 'bg-gray-400 text-white' : ''
                  }
                  onClick={() => selectBall(ball)}
                />)
              })}
            </div>
          </ScrollArea>
        </div>

      </DialogContent>
    </Dialog>
  )
}
