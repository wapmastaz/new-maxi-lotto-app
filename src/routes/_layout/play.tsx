import { createFileRoute } from '@tanstack/react-router'

import Ball from "@/components/ball"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFetchDailyGames, useGetBetTypes } from "@/hooks/useGames"
import { usePlaceBet } from "@/hooks/usePlaceBet"
import useAuthStore from "@/store/authStore"
import type { BetList, BetType, Game } from "@/types/game"
import { zodResolver } from "@hookform/resolvers/zod"
import type { EmblaOptionsType } from 'embla-carousel'
import { ShoppingBasketIcon, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Separator } from "@/components/ui/separator"
import { useFetchFavouriteBalls } from "@/hooks/useUserProfile"
import { Badge } from '@/components/ui/base-badge'
import { BetCart } from '@/components/play/bet-cart'
import BetSlip from '@/components/play/bet-slip'
import { FavouriteBallDialog } from '@/components/play/favourite-ball-dialog'
import GameCarousel from '@/components/play/game-carousel'

// ✅ validation schema
const FormSchema = z.object({
  betType: z.string().min(1, "Please select a bet type"),
})

const OPTIONS: EmblaOptionsType = { loop: true }

export const Route = createFileRoute('/_layout/play')({
  component: RouteComponent,
})

function RouteComponent() {

  const [selectedBalls, setSelectedBalls] = useState<number[]>([])
  const [betsList, setBetsList] = useState<BetList[]>([])
  const [selectedBetType, setSelectedBetType] = useState<BetType | null>(null)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  const [bankerBalls, setBankerBalls] = useState<number[]>([]);
  const [againstBalls, setAgainstBalls] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState<"normal" | "banker" | "against">("normal");
  const [openDialog, setOpenDialog] = useState<boolean>(false);


  const { data: betTypes } = useGetBetTypes()
  const { minimalUser: user, syncUser } = useAuthStore(state => state)
  const { data: games } = useFetchDailyGames()
  const { data: favoriteBalls } = useFetchFavouriteBalls();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  // watch selected bet type
  const betTypeId = form.watch("betType")

  // update selectedBetType when betTypeId changes
  // find your React.useEffect that watches `betTypeId` and add resets
  // update selectedBetType when betTypeId changes - MODIFIED
  useEffect(() => {
    if (betTypes && betTypeId) {
      const betType = betTypes.find((betType) => betType.betTypeID === Number(betTypeId))
      setSelectedBetType(betType || null)

      // --- NEW LOGIC TO SET SELECTION MODE ---
      if (betType?.code.toUpperCase().includes("BANKER")) {
        setSelectionMode("banker");
        setSelectedBalls([]); // Clear other selections
      } else if (betType?.code.toUpperCase().includes("AGAINST")) {
        setSelectionMode("against");
        setBankerBalls([]); // Clear other selections
      } else {
        setSelectionMode("normal");
        setBankerBalls([]); // Clear other selections
        setAgainstBalls([]);
      }
      // --- END NEW LOGIC ---

    } else {
      setSelectedBetType(null)
      setSelectionMode("normal"); // Reset mode if no bet type is selected
    }
  }, [betTypes, betTypeId])

  // ✅ handle selecting balls
  // 🔄 REPLACE your existing selectBall function with this

  // ✅ handle selecting balls - MODIFIED
  // 🚀 REVISED: handle selecting balls
  // const selectBall = (ball: number) => {
  //   if (!selectedGame) {
  //     toast.error("Please select a game first");
  //     return;
  //   }

  //   if (!selectedBetType) {
  //     toast.error("Please select bet type first");
  //     return;
  //   }

  //   // Determine the array to modify based on the current selection mode
  //   let currentBalls: number[] = [];
  //   let setBalls: React.Dispatch<React.SetStateAction<number[]>>;
  //   let maxBalls: number = selectedBetType.maximumNumberOfBalls;
  //   let modeName: string = selectedBetType.code;

  //   if (selectionMode === "banker") {
  //     currentBalls = bankerBalls;
  //     setBalls = setBankerBalls;
  //     maxBalls = 1; // Banker is always 1 ball
  //     modeName = "Banker";
  //   } else if (selectionMode === "against") {
  //     currentBalls = againstBalls;
  //     setBalls = setAgainstBalls;
  //     // Against balls usually have a large maximum (e.g., 89 or a user-defined max)
  //     // For simplicity, let's set a high limit or a specific limit from the API if available.
  //     // Assuming a max of 10 for 'Against Singles' secondary selection, otherwise use 90.
  //     maxBalls = selectedBetType ? selectedBetType.maximumNumberOfBalls : 20;
  //     modeName = "Against Balls";
  //   } else { // selectionMode === "normal" (for DIRECT, PERM, and AGAINST/MAIN)
  //     currentBalls = selectedBalls;
  //     setBalls = setSelectedBalls;
  //     maxBalls = selectedBetType.maximumNumberOfBalls;
  //     modeName = selectedBetType.code;
  //   }

  //   const isSelected = currentBalls.includes(ball);

  //   if (isSelected) {
  //     // Remove the ball from the array
  //     setBalls(currentBalls.filter((b) => b !== ball));
  //   } else {
  //     // Add the ball to the array
  //     if (currentBalls.length >= maxBalls) {
  //       toast.error(
  //         `Max ${maxBalls} balls allowed for ${modeName} selection.`
  //       );
  //       return;
  //     }
  //     setBalls([...currentBalls, ball]);
  //   }
  // }

  // Assuming this is inside PlayNow.tsx or where your state logic lives
  const selectBall = (ball: number) => {
    // Check if a bet type is even selected
    if (!selectedBetType) {
      toast.error("Please select a bet type first.");
      return;
    }

    const code = selectedBetType.code.toUpperCase();
    const isAgainstBet = code.includes("AGAINST");

    // --- Determine Target Array ---
    let targetBalls: number[];
    let setTargetBalls: React.Dispatch<React.SetStateAction<number[]>>;
    let opponentBalls: number[];
    let opponentSetName: string;

    if (selectionMode === "banker") {
      // ... Banker logic (not affected by this specific check) ...
      // ... (If the logic requires exclusivity with other modes, you'd add checks here)
      targetBalls = bankerBalls;
      setTargetBalls = setBankerBalls;
      opponentBalls = []; // Banker is simple
      opponentSetName = "";

    } else if (selectionMode === "against") {
      targetBalls = againstBalls;
      setTargetBalls = setAgainstBalls;
      opponentBalls = selectedBalls; // Opponent is the Main Group
      opponentSetName = "Main Bets";

    } else { // selectionMode === "normal" (used for Main Group in Against Singles)
      targetBalls = selectedBalls;
      setTargetBalls = setSelectedBalls;
      opponentBalls = againstBalls; // Opponent is the Against Group
      opponentSetName = "Against Bets";
    }

    // --- ENFORCING EXCLUSIVITY FOR AGAINST BETS ---
    if (isAgainstBet && opponentBalls.includes(ball)) {
      toast.error(`Error: Ball ${ball} is already selected in your ${opponentSetName}. Remove it there first.`);
      // Set collision count to 1 to indicate an error state if needed, but preventing selection is better.
      // setCollisionCount(1); // Optional: if you still need to track collision count
      return;
    }
    // ----------------------------------------------

    // --- Standard Add/Remove Logic ---
    const isSelected = targetBalls.includes(ball);

    if (isSelected) {
      // Remove the ball
      setTargetBalls(targetBalls.filter((b) => b !== ball));
    } else {
      // Check limits before adding
      if (targetBalls.length >= selectedBetType.maximumNumberOfBalls && selectionMode !== "against") {
        // Standard limit check for Direct/Perm/Main groups
        toast.error(`Maximum balls for this bet type is ${selectedBetType.maximumNumberOfBalls}`);
        return;
      }

      // Add the ball
      setTargetBalls([...targetBalls, ball]);
    }

    // After successful selection, reset collision count if needed
    // setCollisionCount(0); // Optional
  };

  // helper to generate random unique numbers
  const getRandomBalls = (count: number, max: number): number[] => {
    const numbers: number[] = []
    while (numbers.length < count) {
      const rand = Math.floor(Math.random() * max) + 1
      if (!numbers.includes(rand)) {
        numbers.push(rand)
      }
    }
    return numbers
  }

  // quick pick function
  // const handleQuickPick = () => {
  //   if (!selectedGame) {
  //     toast.error("Please select a game first");
  //     return;
  //   }

  //   if (!selectedBetType) {
  //     toast.error("Please select bet type first")
  //     return
  //   }

  //   const count = selectedBetType.maximumNumberOfBalls // or random within min-max
  //   const randomBalls = getRandomBalls(count, 90)
  //   setSelectedBalls(randomBalls)
  // }

  // 🚀 REVISED: quick pick function
  const handleQuickPick = () => {
    // ... error checks remain ...

    // Determine the target array and max count
    let targetSetState: React.Dispatch<React.SetStateAction<number[]>> = setSelectedBalls;
    let count = selectedBetType ? selectedBetType.maximumNumberOfBalls : 0;

    if (selectionMode === "banker") {
      targetSetState = setBankerBalls;
      count = 1;
    } else if (selectionMode === "against") {
      targetSetState = setAgainstBalls;
      // Use a reasonable number like 5 for quick pick of against balls
      count = 5;
    }

    const max = 90;
    const randomBalls = getRandomBalls(count, max);

    targetSetState(randomBalls);
  }


  // ✅ clear all
  const clearSelection = () => setSelectedBalls([])

  // ✅ place bet
  const { handlePlaceBet, loading } = usePlaceBet({
    user,
    betsList, // your state from the BetSlip
    selectedGame: selectedGame,
    resetAllGames: () => {
      setBetsList([])
    },
    syncUser
  })

  const handleRemoveItem = (index: number) => {
    const updatedBets = [...betsList];
    updatedBets.splice(index, 1);
    setBetsList(updatedBets);
    toast.success("Bet removed successfully!");
  }

  const handleClearCart = () => {
    setBetsList([]);
    toast.success("Cart cleared successfully!");
  }

  const handleSelectedGame = (game: Game) => {
    if (game) {
      setSelectedGame(game);
      form.reset({ betType: "" }); // ✅ clear old bet type
      setSelectedBetType(null);
      setSelectedBalls([]); // ✅ clear old selection
      setBetsList([]); // optional, to clear bets from previous game
      const betTypeSelect = document.getElementById("betTypeSelect");
      betTypeSelect?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const handleResetBetSlips = () => {
    form.reset({ betType: "" }); // ✅ clear old bet type
    setSelectedBalls([]); // ✅ clear old selection
    const betTypeSelect = document.getElementById("betTypeSelect");
    betTypeSelect?.scrollIntoView({ behavior: "smooth" });
  }

  // ✅ handle All / Even / Odd picks
  // const handleSelectPattern = (pattern: "all" | "even" | "odd") => {
  //   if (!selectedGame) {
  //     toast.error("Please select a game first")
  //     return
  //   }

  //   if (!selectedBetType) {
  //     toast.error("Please select bet type first")
  //     return
  //   }

  //   const max = 90
  //   let numbers: number[] = []

  //   if (pattern === "all") {
  //     numbers = Array.from({ length: max }, (_, i) => i + 1)
  //   } else if (pattern === "even") {
  //     numbers = Array.from({ length: max / 2 }, (_, i) => (i + 1) * 2)
  //   } else if (pattern === "odd") {
  //     numbers = Array.from({ length: Math.ceil(max / 2) }, (_, i) => i * 2 + 1)
  //   }

  const handleSelectPattern = (pattern: "all" | "even" | "odd") => {
    if (!selectedGame) {
      toast.error("Please select a game first");
      return;
    }

    if (!selectedBetType) {
      toast.error("Please select bet type first");
      return;
    }

    // 🎯 1. DETERMINE TARGET ARRAY AND MAX LIMIT
    let setTargetBalls: React.Dispatch<React.SetStateAction<number[]>>;
    let maxLimit: number;

    // We need to use the selectionMode prop from PlayNow.tsx, 
    // assuming it is passed down or accessible here.
    const currentMode = selectionMode; // Assuming 'selectionMode' is accessible (passed as prop or defined in scope)

    if (currentMode === "banker") {
      setTargetBalls = setBankerBalls; // Assuming setBankerBalls is available
      maxLimit = 1; // Banker is always 1 ball
    } else if (currentMode === "against") {
      setTargetBalls = setAgainstBalls; // Assuming setAgainstBalls is available
      // Use a reasonable limit for Against mode (e.g., 20 or 90)
      // If your bet type has a specific max for the AGAINST group, use that here.
      maxLimit = selectedBetType.maximumNumberOfBalls || 90;
    } else { // "normal" mode (for DIRECT, PERM, or AGAINST/Main)
      setTargetBalls = setSelectedBalls; // Current default
      maxLimit = selectedBetType.maximumNumberOfBalls;
    }

    // 2. GENERATE NUMBERS (Original Logic)
    const max = 90;
    let numbers: number[] = [];

    if (pattern === "all") {
      numbers = Array.from({ length: max }, (_, i) => i + 1);
    } else if (pattern === "even") {
      numbers = Array.from({ length: max / 2 }, (_, i) => (i + 1) * 2);
    } else if (pattern === "odd") {
      numbers = Array.from({ length: Math.ceil(max / 2) }, (_, i) => i * 2 + 1);
    }

    // 3. APPLY SHUFFLE AND LIMIT
    // Shuffle the full set and take only the required number of balls.
    const shuffled = numbers.sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, maxLimit);

    // 4. SET THE CORRECT STATE
    setTargetBalls(limited);
  }

  //   // shuffle and limit to the bet type's maximum
  //   const shuffled = numbers.sort(() => Math.random() - 0.5)
  //   const limited = shuffled.slice(0, selectedBetType.maximumNumberOfBalls)
  //   setSelectedBalls(limited)
  // }

  // Assuming this function is in PlayNow.tsx or accessible there,
  // and that `selectionMode` and all state setters are available.

  return (
    <section className="py-8 sm:py-12 min-h-screen bg-gradient-to-b from-[#01B1A8] to-[#0185B6]">
      <div className="container mx-auto px-4">
        {/* form */}
        {games && (
          <GameCarousel handleSelectedGame={handleSelectedGame} games={games} options={OPTIONS} />
        )}
        <Separator className="my-3" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {
          })}>
            {/* header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-lg md:text-3xl font-bold text-white">Play</h1>
              <FormField
                control={form.control}
                name="betType"
                render={({ field }) => (
                  <FormItem id="betTypeSelect">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedGame}
                    >
                      <FormControl
                        className="border-2 border-[#0A4B7F] rounded-4xl px-10 text-[#0A4B7F] font-semibold bg-white">
                        <SelectTrigger>
                          <SelectValue placeholder={
                            selectedGame ? "Select bet type" : "Select game first"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {betTypes?.map((betType) => (
                          <SelectItem
                            key={betType.betTypeID}
                            value={String(betType.betTypeID)}
                          >
                            {betType.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* actions */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-1">
                <Button onClick={() => handleSelectPattern("all")} size="sm" className="h-5 px-4 text-xs bg-[#0A4B7F] text-white">
                  All
                </Button>
                <Button onClick={() => handleSelectPattern("even")} size="sm" className="h-5 px-4 text-xs bg-[#0A4B7F] text-white">
                  Even
                </Button>
                <Button onClick={() => handleSelectPattern("odd")} size="sm" className="h-5 px-4 text-xs bg-[#0A4B7F] text-white">
                  Odd
                </Button>
              </div>
              <div className="flex gap-2">
                {favoriteBalls && favoriteBalls.length > 0 && (
                  <Button
                    size="sm"
                    className="h-7 px-4 text-xs bg-[#0A4B7F] text-[#FFF100] rounded-4xl"
                    onClick={() => setOpenDialog(true)}
                  >
                    Favourite Balls
                  </Button>
                )}

                <Button
                  size="sm"
                  className="h-7 px-4 text-xs bg-[#0A4B7F] text-[#FFF100] rounded-4xl"
                  onClick={handleQuickPick}
                >
                  Quick Pick
                </Button>
                <Button
                  size="icon"
                  type="button"
                  onClick={clearSelection}
                  className="h-7 w-7 bg-[#FFF100] text-[#0A4B7F] rounded-full"
                >
                  <Trash2Icon size={14} />
                </Button>
              </div>
            </div>

            {/* ✨ NEW: Banker/Against Selection Mode UI ✨ */}
            {/* {selectedBetType && (selectedBetType.code.toUpperCase().includes("BANKER") || selectedBetType.code.toUpperCase().includes("AGAINST")) && (
              <div className="flex justify-center items-center my-4 p-2 bg-white/20 rounded-lg gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-white font-semibold mb-2">1. Select Banker(s)</span>
                  <Button
                    onClick={() => setSelectionMode("banker")}
                    variant={selectionMode === 'banker' ? 'primary' : 'outline'}
                    className={`w-32 ${selectionMode === 'banker' ? 'bg-[#FFF100] text-[#0A4B7F]' : 'bg-transparent text-white border-white'}`}
                  >
                    Select Banker
                  </Button>
                  <div className="flex gap-1 mt-2">
                    {bankerBalls.map(b => <Ball key={b} value={b} isSelected className="w-6 h-6 text-xs" />)}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white font-semibold mb-2">2. Select Against</span>
                  <Button
                    onClick={() => setSelectionMode("against")}
                    variant={selectionMode === 'against' ? 'primary' : 'outline'}
                    className={`w-32 ${selectionMode === 'against' ? 'bg-[#FFF100] text-[#0A4B7F]' : 'bg-transparent text-white border-white'}`}
                  >
                    Select Against
                  </Button>
                  <div className="flex gap-1 mt-2 flex-wrap justify-center max-w-xs">
                    {againstBalls.map(b => <Ball key={b} value={b} isSelected className="w-6 h-6 text-xs bg-gray-300" />)}
                  </div>
                </div>
              </div>
            )} */}

            {/* existing: {selectedBalls.length > 0 && ( ... )} */}

            {/* CONDITIONAL DISPLAY OF SELECTED NUMBERS - MODIFIED */}
            <div className="flex flex-col items-center w-full mt-6">
              <span className="text-white mb-2">
                {selectedBetType?.code.toUpperCase().includes("BANKER") ? "Banker Selection (1 Ball)" :
                  selectedBetType?.code.toUpperCase().includes("AGAINST") ? "Main/Against Selection" :
                    "Selected Numbers"}
              </span>

              {/* --- AGAINST MODE BUTTONS --- */}
              {selectedBetType?.code.toUpperCase().includes("AGAINST") && (
                <div className="flex gap-4 mb-4">
                  <Button
                    size="sm"
                    onClick={() => setSelectionMode("normal")}
                    className={selectionMode === "normal" ? "bg-green-600 text-white" : "bg-[#0A4B7F] text-white"}
                  >
                    Main Balls ({selectedBalls.length})
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSelectionMode("against")}
                    className={selectionMode === "against" ? "bg-red-600 text-white" : "bg-[#0A4B7F] text-white"}
                  >
                    Against Balls ({againstBalls.length})
                  </Button>
                </div>
              )}
              {/* --- END AGAINST MODE BUTTONS --- */}

              <div
                className="bg-white rounded-2xl shadow w-full max-w-xs py-6 px-4 flex flex-wrap gap-2">

                {/* Banker Selection Display */}
                {selectedBetType?.code.toUpperCase().includes("BANKER") && bankerBalls.map((num) => (
                  <Ball
                    key={`banker-${num}`}
                    value={num}
                    isSelected
                    className="bg-red-500 text-white" // Differentiate Banker
                  />
                ))}

                {/* AGAINST Selection Display (Based on current sub-mode) */}
                {selectedBetType?.code.toUpperCase().includes("AGAINST") && (
                  (selectionMode === "normal" ? selectedBalls : againstBalls).map((num) => (
                    <Ball
                      key={`against-${num}`}
                      value={num}
                      isSelected
                      className={selectionMode === "normal" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                    />
                  ))
                )}

                {/* Normal/Perm Selection Display */}
                {selectionMode === "normal" && !selectedBetType?.code.toUpperCase().includes("AGAINST") && selectedBalls.map((num) => (
                  <Ball
                    key={`normal-${num}`}
                    value={num}
                    isSelected
                    className="bg-[#FFF100] text-[#0A4B7F]"
                  />
                ))}

                {/* Fallback if no numbers selected in any mode */}
                {(selectedBalls.length === 0 && bankerBalls.length === 0 && againstBalls.length === 0) && (
                  <p className="text-center text-gray-500 w-full">No numbers selected.</p>
                )}
              </div>
            </div>

            {/* ball grid */}
            {/* ball grid */}
            <div className="flex flex-wrap gap-4 rounded-2xl p-2">
              {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => {
                // ✨ DETERMINE BALL STATE
                const isBanker = bankerBalls.includes(num);
                const isAgainst = againstBalls.includes(num);
                const isNormalSelected = selectedBalls.includes(num);

                return (
                  <Ball
                    key={num}
                    value={num}
                    // A ball is "selected" if it's in any of the three lists
                    isSelected={isBanker || isAgainst || isNormalSelected}
                    // Apply different styling based on its role
                    className={
                      isBanker ? 'bg-[#FFF100] text-[#0A4B7F] border-2 border-red-500' :
                        isAgainst ? 'bg-gray-400 text-white' : ''
                    }
                    onClick={() => selectBall(num)}
                  />
                );
              })}
            </div>

            {/* selected balls */}
            {/* {selectedBalls.length > 0 && (
              <div className="flex justify-center items-center mt-6">
                <div className="flex flex-col items-center w-full">
                  <span className="text-white mb-2">Selected Numbers</span>
                  <div
                    className="bg-white rounded-2xl shadow w-full max-w-xs py-6 px-4 flex flex-wrap gap-2">
                    {selectedBalls.map((num) => (
                      <Ball
                        key={num}
                        value={num}
                        isSelected
                        className="bg-[#FFF100] text-[#0A4B7F]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )} */}

            {/* bet slip */}
            <div className="flex justify-center mt-6">
              <BetSlip
                selectedBetType={selectedBetType!}
                setSelectedBetType={setSelectedBetType}
                selectedBalls={selectedBalls}
                bankerBalls={bankerBalls} // Pass new state here
                againstBalls={againstBalls} // Pass new state here
                selectionMode={selectionMode}
                collisionCount={0}
                setBetsList={setBetsList}
                setSelectedBalls={setSelectedBalls}
                betLists={betsList}
                selectedGame={selectedGame}
                handleResetBetSlips={handleResetBetSlips}
                setAgainstBalls={setAgainstBalls}
                setBankerBalls={setBankerBalls}
              />
            </div>
          </form>
        </Form>
      </div>

      {favoriteBalls && <FavouriteBallDialog open={openDialog} setOpen={setOpenDialog} favoriteBalls={favoriteBalls} selectBall={selectBall} bankerBalls={bankerBalls} againstBalls={againstBalls} normalBalls={selectedBalls} />}

      {/* Floating Cart Button */}
      <BetCart betLists={betsList} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart}
        handlePlaceBet={handlePlaceBet} loading={loading} selectedGame={selectedGame}>
        <div className="fixed bottom-30 right-2 z-50 animate-in fade-in slide-in-from-bottom-5">
          <Button
            variant="primary"
            size="icon"
            type="button"
            className="relative bg-accent-1-900 right-2 rounded-full shadow-lg hover:bg-[#0185B6] hover:text-white transition-all"
          >
            <ShoppingBasketIcon fontSize={20} className="text-primary-900" />
            <Badge
              variant="destructive"
              shape="circle"
              size="sm"
              className="absolute top-0 start-full -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2"
            >
              {betsList.length}
            </Badge>
          </Button>
        </div>
      </BetCart>

    </section>
  )
}
