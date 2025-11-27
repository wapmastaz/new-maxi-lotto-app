import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, combination } from '@/lib/utils'
import type { BetList, BetType, Game } from '@/types/game'
import { useEffect, useState } from 'react'

import { toast } from 'sonner'

interface BetSlipProps {
  selectedBalls: number[]
  bankerBalls: number[]
  againstBalls: number[]
  selectedBetType: BetType
  collisionCount: number
  setBetsList: React.Dispatch<React.SetStateAction<BetList[]>>
  betLists: BetList[]
  setSelectedBalls: React.Dispatch<React.SetStateAction<number[]>>
  setBankerBalls: React.Dispatch<React.SetStateAction<number[]>>
  setAgainstBalls: React.Dispatch<React.SetStateAction<number[]>>
  setSelectedBetType: React.Dispatch<React.SetStateAction<BetType | null>>
  selectedGame: Game | null
  handleResetBetSlips: () => void
  selectionMode: "normal" | "banker" | "against"
}


const BetSlip = ({ selectedBalls, selectedBetType, collisionCount, againstBalls, setBetsList, selectedGame, handleResetBetSlips, setBankerBalls, setAgainstBalls, bankerBalls }: BetSlipProps) => {

  const [stake, setStake] = useState<number>(0)
  const [maxWinning, setMaxWinning] = useState<number>(0)
  const [numberOfLines, setNumberOfLines] = useState<number>(0)

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value > selectedBetType.maximumStake) {
      toast.error(`Maximum stake is ₦${selectedBetType.maximumStake}`)
      setStake(selectedBetType.maximumStake);
      return
    }
    setStake(value)
  }


  useEffect(() => {
    if (!selectedBetType) return;

    const betType = selectedBetType;
    const amount = stake;
    let result = 0;
    let noOfLines = 0;

    const code = betType.code.toUpperCase();
    const r = betType.minimumNumberOfBalls;

    // --- Core Logic ---

    // 1. BANKER Logic
    if (code.includes("BANKER")) {
      // Banker bets typically combine the single banker ball with every opponent ball.
      // Assuming your 'Against' balls (againstBalls array) are the opponents.
      if (bankerBalls.length === 1) {
        noOfLines = 89; // Fixed lines for 1 vs All
        // Create an array of numbers from 1 to 90, excluding the Banker ball.
      } else {
        noOfLines = 0;
      }
    }

    // 2. AGAINST Logic (e.g., AGAINST SINGLES)
    else if (code.includes("AGAINST")) {
      // AGAINST bets multiply the size of the two groups: Main (selectedBalls) x Against (againstBalls).
      // The bet line is (1 ball from Main) combined with (1 ball from Against).

      if (selectedBalls.length >= r && againstBalls.length >= 1) { // Assuming minimum 1 against ball
        noOfLines = selectedBalls.length * againstBalls.length;

        // NOTE: collisionCount is included if the server requires client-side deduction 
        // for overlapping numbers in the two groups, though usually, groups should be unique.
        noOfLines = noOfLines - collisionCount;
      } else {
        noOfLines = 0; // Not enough balls selected
      }
    }

    // 3. DIRECT/PERM Logic (Standard lotto bets)
    else {
      const n = selectedBalls.length > 5 ? 5 : selectedBalls.length;

      // If not enough balls, reset and return
      if (n < r) {
        setNumberOfLines(0);
        setMaxWinning(0);
        return;
      }

      if (code.includes("DIRECT") && n === r) {
        // DIRECT: Fixed number of selections equal to r (e.g., DIRECT 3 with 3 balls) is always 1 line.
        noOfLines = 1;
      }
      else if (code.includes("PERM")) {
        // PERM: Select n balls to cover r lines. Uses COMBINATION (order doesn't matter).
        // ❌ Fix: Replaced 'permutation(n, r)' with 'combination(n, r)'
        noOfLines = combination(n, r);
      }
    }

    // --- Final Calculation ---
    result = noOfLines * amount * betType.winFactor;

    setNumberOfLines(noOfLines);
    setMaxWinning(result);

    // Added bankerBalls to dependencies.
  }, [selectedBalls, stake, selectedBetType, againstBalls, bankerBalls, collisionCount]);



  // const handleAddToBets = () => {
  //   if (!selectedGame) return toast.error("Please select a game first")
  //   if (!selectedBetType) return toast.error("Select a bet type first")

  //   const code = selectedBetType.code.toUpperCase()

  //   // --- REVISED VALIDATION ---
  //   if (code.includes("BANKER")) {
  //     // Assuming Banker vs. Against Balls
  //     if (bankerBalls.length !== 1)
  //       return toast.error("Select exactly 1 Banker ball.")

  //     // Assuming AGAINST balls are the opponents
  //     // if (againstBalls.length < selectedBetType.minimumNumberOfBalls)
  //     //   return toast.error(`Select at least ${selectedBetType.minimumNumberOfBalls} opponent balls (Against).`)

  //   } else if (code.includes("AGAINST")) {
  //     // Assuming Against Singles (Main Group vs. Against Group)

  //     // Main Group check
  //     if (selectedBalls.length < selectedBetType.minimumNumberOfBalls)
  //       return toast.error(`Select at least ${selectedBetType.minimumNumberOfBalls} Main ball(s).`)

  //     // Against Group check (we'll assume a minimum of 1 for the Against group)
  //     if (againstBalls.length < 1)
  //       return toast.error("Select at least 1 Against ball.")

  //   } else {
  //     // DIRECT/PERM logic
  //     if (selectedBalls.length < selectedBetType.minimumNumberOfBalls)
  //       return toast.error(`Select at least ${selectedBetType.minimumNumberOfBalls} ball(s).`)
  //   }

  //   const newBet: BetList = {
  //     betType: selectedBetType,
  //     selectedBalls,
  //     bankerBalls,
  //     againstBalls,
  //     stake,
  //     maxWinning,
  //     numberOfLines,
  //   }

  //   setBetsList(prev => [...prev, newBet])
  //   resetBetSlip()
  //   toast.success("Bet added successfully!")
  // }

  const handleAddToBets = () => {
    if (!selectedGame) return toast.error("Please select a game first");
    if (!selectedBetType) return toast.error("Select a bet type first");

    const code = selectedBetType.code.toUpperCase();

    if (stake < selectedBetType.minimumStake || stake > selectedBetType.maximumStake)
      return toast.error(`Stake must be between ₦${selectedBetType.minimumStake} and ₦${selectedBetType.maximumStake}`);

    // --- TEMPORARY ARRAY FOR BET CREATION ---
    let finalAgainstBalls: number[] = againstBalls;

    // --- REVISED VALIDATION & POPULATION ---
    if (code.includes("BANKER")) {
      // Banker Against All: Requires exactly 1 banker ball.
      if (bankerBalls.length !== 1)
        return toast.error("Select exactly 1 Banker ball.");

      // ✅ POPULATE THE 89 OPPONENT BALLS
      const banker = bankerBalls[0];

      // Create an array of numbers from 1 to 90, excluding the Banker ball.
      finalAgainstBalls = Array.from({ length: 90 }, (_, i) => i + 1).filter(
        (num) => num !== banker
      );

    } else if (code.includes("AGAINST")) {
      // Against Singles: Requires Main balls (selectedBalls) and Against balls (againstBalls).
      if (selectedBalls.length < selectedBetType.minimumNumberOfBalls)
        return toast.error(`Select at least ${selectedBetType.minimumNumberOfBalls} Main ball(s).`);

      if (againstBalls.length < 1)
        return toast.error("Select at least 1 Against ball.");

    } else {
      // DIRECT/PERM logic
      if (selectedBalls.length < selectedBetType.minimumNumberOfBalls)
        return toast.error(`Select at least ${selectedBetType.minimumNumberOfBalls} ball(s).`);
    }
    // --- END REVISED VALIDATION & POPULATION ---

    // The key here is passing 'finalAgainstBalls' which holds either the 
    // user-selected against balls (for AGAINST bet) or the generated 89 balls (for BANKER bet).
    const newBet: BetList = {
      betType: selectedBetType,
      selectedBalls, // Empty for Banker, Main for Against
      bankerBalls,   // The single Banker ball
      againstBalls: finalAgainstBalls, // ⬅️ Populated with 89 balls for Banker!
      stake,
      maxWinning,
      numberOfLines,
    };

    setBetsList(prev => [...prev, newBet]);
    resetBetSlip();
    toast.success("Bet added successfully!");
  };



  const resetBetSlip = () => {
    setStake(0)
    setMaxWinning(0)
    setBankerBalls([])
    setAgainstBalls([])
    handleResetBetSlips()
  }




  return (
    <div
      className={cn("bg-background rounded-2xl shadow-md w-full max-w-xs py-6 px-4 space-y-8")}
    >
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

        <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
          <span className="font-bold">Maximum Win:</span>
          <span className="text-foreground-muted">
            ₦{maxWinning}
          </span>
        </div>

        {/* 🎯 BET NUMBERS DISPLAY */}
        {/* REVISED BET NUMBERS DISPLAY FOR AGAINST BETS */}

        {selectedBetType && (
          <>
            {/* --- BANKER Logic Display --- */}
            {selectedBetType.code.toUpperCase() === "BANKER" && (
              <>
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                  <span className="font-bold">Banker:</span>
                  <span className="text-foreground-muted">
                    {bankerBalls.length ? bankerBalls.join(", ") : "—"}
                  </span>
                </div>
                {/* 🎯 REPLACED AGAINST BALLS DISPLAY */}
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                  <span className="font-bold">Opponent Bets:</span>
                  <span className="text-foreground-muted">
                    {bankerBalls.length ? "89 Remaining Balls" : "—"}
                  </span>
                </div>
                {/* ---------------------------------- */}
              </>
            )}

            {/* --- AGAINST Singles Logic Display --- */}
            {/* You should keep your AGAINST display separate and show selectedBalls/againstBalls */}
            {selectedBetType.code.toUpperCase().includes("AGAINST") && (
              <>
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                  <span className="font-bold">Main Bets:</span>
                  <span className="text-foreground-muted">
                    {selectedBalls.length ? selectedBalls.join(", ") : "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                  <span className="font-bold">Against Bets:</span>
                  <span className="text-foreground-muted">
                    {againstBalls.length ? againstBalls.join(", ") : "—"}
                  </span>
                </div>
              </>
            )}

            {/* --- DIRECT/PERM Logic Display --- */}
            {!selectedBetType.code.toUpperCase().includes("BANKER") &&
              !selectedBetType.code.toUpperCase().includes("AGAINST") && (
                <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                  <span className="font-bold">My Bets:</span>
                  <span className="text-foreground-muted">
                    {selectedBalls.length ? selectedBalls.join(", ") : "—"}
                  </span>
                </div>
              )}
          </>
        )}

        <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
          <span className="font-bold">Total Stake:</span>
          <span className="text-foreground-muted">
            ₦{stake}
          </span>
        </div>
      </div>
      {/* 
      <div className="text-xs text-slate-600 mt-4">

      {/* <div className="text-xs text-slate-600 mt-4">
        <p>Type: {selectedBetType?.code}</p>
        <p>Selected: {JSON.stringify(selectedBalls)}</p>
        <p>Banker: {JSON.stringify(bankerBalls)}</p>
        <p>Against: {JSON.stringify(againstBalls)}</p>
      </div> 
      </div>
*/}

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
