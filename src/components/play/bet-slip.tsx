import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { BetList, BetType, Game } from '@/types/game'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface BetSlipProps {
  selectedBalls: number[]
  bankerBalls: number[]
  againstBalls: number[]
  selectedBetType: BetType
  collisionCount: number
  betLists: BetList[]
  setSelectedBalls: React.Dispatch<React.SetStateAction<number[]>>
  setBankerBalls: React.Dispatch<React.SetStateAction<number[]>>
  setAgainstBalls: React.Dispatch<React.SetStateAction<number[]>>
  setSelectedBetType: React.Dispatch<React.SetStateAction<BetType | null>>
  selectedGame: Game | null
  handleResetBetSlips?: () => void // Make optional since we're not using it in reset
  selectionMode: "normal" | "banker" | "against"
  isMainBall: boolean,
  addBet: (betList: BetList) => void,
}

// Factorial calculation
const factorial = (r: number): number => {
  if (r <= 1) return 1
  return r * factorial(r - 1)
}

// Combination calculation
const combination = (n: number, r: number): number => {
  if (n < r) return 0
  return Math.round(factorial(n) / (factorial(n - r) * factorial(r)))
}

const BetSlip = ({
                   selectedBalls,
                   selectedBetType,
                   againstBalls,
                   addBet,
                   selectedGame,
                   setAgainstBalls,
                   setSelectedBalls
                 }: BetSlipProps) => {

  const [stake, setStake] = useState<number>(0)
  const [maxWinning, setMaxWinning] = useState<number>(0)
  const [numberOfLines, setNumberOfLines] = useState<number>(0)

  // Calculate collision count (following Vue logic)
  const collisionCount = () => {
    if (selectedBalls.length === 0 || againstBalls.length === 0) return 0
    return selectedBalls.filter((ball) => againstBalls.includes(ball)).length
  }

  // Calculate max winning (following Vue logic exactly)
  const calculateMaxWinning = () => {
    if (!selectedBetType) return 0
    if (selectedBalls.length < selectedBetType.minimumNumberOfBalls) return 0

    const code = selectedBetType.code
    const nap = selectedBetType.nap

    // BANKER logic
    if (code === 'BANKER') {
      if (selectedBalls.length > 1) {
        return 5 * (stake || 5) * selectedBetType.winFactor
      }
      return 0
    }

    // AGAINST (AG) logic
    if (nap === 'AG') {
      // @ts-ignore
      const maxBall = (selectedBalls.length + againstBalls.length) > 5
        ? 5
        : (selectedBalls.length + againstBalls.length)
      const noOfLines = selectedBalls.length * againstBalls.length - collisionCount()
      return noOfLines * stake * selectedBetType.winFactor
    }

    // AGAINST SINGLES (AGS) logic
    if (nap === 'AGS') {
      const noOfLines = selectedBalls.length * againstBalls.length - collisionCount()
      return noOfLines * stake * selectedBetType.winFactor
    }

    // DIRECT/PERM logic
    const maxBall = selectedBalls.length > 5 ? 5 : selectedBalls.length
    const noOfLines = combination(maxBall, selectedBetType.minimumNumberOfBalls)
    return noOfLines * stake * selectedBetType.winFactor
  }

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value > selectedBetType.maximumStake) {
      toast.error(`Maximum stake is ₦${selectedBetType.maximumStake}`)
      setStake(selectedBetType.maximumStake)
      return
    }
    setStake(value)
  }

  // Calculate lines and max winning (following Vue logic)
  useEffect(() => {
    if (!selectedBetType) {
      setNumberOfLines(0)
      setMaxWinning(0)
      return
    }

    let lines = 0
    const code = selectedBetType.code
    const nap = selectedBetType.nap

    // BANKER: Always 89 lines when 1 ball selected
    if (code === 'BANKER') {
      lines = selectedBalls.length === 1 ? 89 : 0
    }
    // AGAINST SINGLES (AGS)
    else if (nap === 'AGS') {
      if (selectedBalls.length >= 1 && againstBalls.length >= 1) {
        lines = selectedBalls.length * againstBalls.length - collisionCount()
      }
    }
    // DIRECT/PERM
    else {
      if (selectedBalls.length >= selectedBetType.minimumNumberOfBalls) {
        lines = combination(selectedBalls.length, selectedBetType.minimumNumberOfBalls)
      }
    }

    setNumberOfLines(lines)
    setMaxWinning(calculateMaxWinning())
  }, [selectedBalls, againstBalls, stake, selectedBetType])

  const handleAddToBets = () => {
    if (!selectedGame) return toast.error("Please select a game first")
    if (!selectedBetType) return toast.error("Select a bet type first")

    const code = selectedBetType.code
    const nap = selectedBetType.nap

    if (stake < selectedBetType.minimumStake || stake > selectedBetType.maximumStake)
      return toast.error(`Stake must be between ₦${selectedBetType.minimumStake} and ₦${selectedBetType.maximumStake}`)

    // Validation (following Vue logic)
    if (code === 'BANKER') {
      if (selectedBalls.length !== 1)
        return toast.error("Select exactly 1 Banker ball.")
    } else if (nap === 'AGS') {
      if (selectedBalls.length < selectedBetType.minimumNumberOfBalls)
        return toast.error(`Select at least ${selectedBetType.minimumNumberOfBalls} Main ball(s).`)
      if (againstBalls.length < 1)
        return toast.error("Select at least 1 Against ball.")
    } else {
      if (selectedBalls.length < selectedBetType.minimumNumberOfBalls)
        return toast.error(`Select at least ${selectedBetType.minimumNumberOfBalls} ball(s).`)
    }

    // Calculate total stake (lines * stake per line)
    const totalAmount = numberOfLines * stake

    const newBet: BetList = {
      betType: selectedBetType,
      selectedBalls: [...selectedBalls],
      bankerBalls: code === 'BANKER' ? [...selectedBalls] : [],
      againstBalls: nap === 'AGS' ? [...againstBalls] : [],
      stake: totalAmount,
      amount: stake,
      maxWinning,
      numberOfLines,
    }

    addBet(newBet)
    resetBetSlip()
    toast.success("Bet added successfully!")

    // Scroll to games list after adding
    setTimeout(() => {
      document.getElementById("gamesListSection")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 300)
  }

  const resetBetSlip = () => {
    setStake(0)
    setMaxWinning(0)
    setAgainstBalls([])
    setSelectedBalls([])
    // Don't call handleResetBetSlips here to avoid scrolling to top
  }

  return (
    <div className={cn("bg-background rounded-2xl shadow-md w-full max-w-sm py-6 px-4 space-y-8")}>

    {/* Header */}
      <div className="flex justify-center">
        <h4 className="bg-[#0185B6] text-background font-bold px-8 py-3 rounded-full text-lg">
          Bet Slip
        </h4>
      </div>

      {/* Content */}
      <div className="text-base space-y-4 font-poppins">
        <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
          <span className="font-bold">Game:</span>
          <span className="text-foreground-muted">{selectedGame?.gameName || "N/A"}</span>
        </div>

        <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
          <span className="font-bold">Type:</span>
          <span className="text-foreground-muted">{selectedBetType?.code || "N/A"}</span>
        </div>

        {/* BET NUMBERS DISPLAY (Following Vue logic) */}
        {selectedBetType && (
          <>
            <div className="flex flex-col border-b border-dashed border-gray-300 pb-1">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-sm">My Bets:</span>
              </div>
              <div className="text-xs text-foreground-muted break-words">
                {selectedBalls.length > 0 ? (
                  <>
                    {selectedBalls.join('-')}
                    {selectedBetType.code === 'BANKER' && (
                      <span className="ml-2 font-bold">AG 1-90</span>
                    )}
                  </>
                ) : '—'}
              </div>

              {/* Show Against Balls for AGS */}
              {selectedBetType.nap === 'AGS' && againstBalls.length > 0 && (
                <div className="text-xs text-foreground-muted mt-1">
                  <span className="font-bold">AG </span>
                  {againstBalls.join('-')}
                </div>
              )}
            </div>

            <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
              <span className="font-bold">Max. Win per Balls:</span>
              <span className="text-foreground-muted">₦{maxWinning.toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
              <span className="font-bold">Number of lines:</span>
              <span className="text-foreground-muted">{numberOfLines}</span>
            </div>

            <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
              <span className="font-bold">Total Stake:</span>
              <span className="text-foreground-muted">₦{(numberOfLines * stake).toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Input Field for Stake */}
      <div className="space-y-1">
        <Input
          id="stake"
          placeholder="Enter stake amount"
          type="number"
          value={stake === 0 ? '' : stake}
          onChange={handleStakeChange}
          className="border border-gray-300 rounded-3xl px-4 py-3"
        />
        <span className="mt-1 text-sm opacity-80">
          Min: ₦{selectedBetType?.minimumStake} | Max: ₦{selectedBetType?.maximumStake}
        </span>
      </div>

      {/* Place Bet Button */}
      <Button
        onClick={handleAddToBets}
        size={"lg"}
        className="w-full bg-[#0185B6] text-yellow-400 rounded-full hover:opacity-80"
      >
        Add Game
      </Button>
    </div>
  )
}

export default BetSlip