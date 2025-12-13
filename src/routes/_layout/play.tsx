import { createFileRoute } from '@tanstack/react-router'
import Ball from "@/components/ball"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
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

const FormSchema = z.object({
  betType: z.string().min(1, "Please select a bet type"),
})

const OPTIONS: EmblaOptionsType = { loop: true }

export const Route = createFileRoute('/_layout/play')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedBalls, setSelectedBalls] = useState<number[]>([])
  const [againstBalls, setAgainstBalls] = useState<number[]>([])
  const [isMainBall, setIsMainBall] = useState<boolean>(true)
  const [betsList, setBetsList] = useState<BetList[]>([])
  const [selectedBetType, setSelectedBetType] = useState<BetType | null>(null)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const { data: betTypes } = useGetBetTypes()
  const { minimalUser: user, syncUser } = useAuthStore(state => state)
  const { data: games } = useFetchDailyGames()
  const { data: favoriteBalls } = useFetchFavouriteBalls(user)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const betTypeId = form.watch("betType")

  // Update selectedBetType when betTypeId changes
  useEffect(() => {
    if (betTypes && betTypeId) {
      const betType = betTypes.find((betType) => betType.betTypeID === Number(betTypeId))
      setSelectedBetType(betType || null)
    } else {
      setSelectedBetType(null)
    }
  }, [betTypes, betTypeId])

  // Watch for bet type changes and reset (following Vue logic)
  useEffect(() => {
    if (selectedBetType) {
      resetBetSlip()

      // If not AGS, switch to main ball and clear against
      if (selectedBetType.nap !== 'AGS') {
        setAgainstBalls([])
        setIsMainBall(true)
      }
    }
  }, [selectedBetType?.betTypeID])

  // Activate against ball selection (Vue logic)
  const activateAgainstBall = () => {
    if (!selectedBetType) {
      toast.error('Please select bet type first')
      return
    }
    if (selectedBetType.nap !== 'AGS') {
      toast.error('Please select against bet type first')
      return
    }
    setIsMainBall(false)
  }

  // Select ball function (following Vue logic)
  const selectBall = (ball: number) => {
    if (!selectedBetType) {
      toast.error("Please select bet type first")
      return
    }

    if (isMainBall) {
      // Main ball selection
      if (selectedBalls.includes(ball)) {
        setSelectedBalls(selectedBalls.filter(b => b !== ball))
        return
      }

      const ballLength = selectedBalls.length + 1
      if (ballLength > selectedBetType.maximumNumberOfBalls) {
        toast.error(
          `Can only pick ${selectedBetType.maximumNumberOfBalls} ball${
            selectedBetType.maximumNumberOfBalls > 1 ? 's' : ''
          } on selected bet type`
        )
        return
      }

      setSelectedBalls([...selectedBalls, ball])
    } else {
      // Against ball selection
      if (againstBalls.includes(ball)) {
        setAgainstBalls(againstBalls.filter(b => b !== ball))
        return
      }

      const ballLength = againstBalls.length + 1
      if (ballLength > selectedBetType.maximumNumberOfBalls) {
        toast.error(
          `Can only pick ${selectedBetType.maximumNumberOfBalls} ball${
            selectedBetType.maximumNumberOfBalls > 1 ? 's' : ''
          } on selected bet type`
        )
        return
      }

      setAgainstBalls([...againstBalls, ball])
    }
  }

  // Random ball selection with random count between min and max
  const selectRandomBalls = (pattern: 'random' | 'even' | 'odd') => {
    if (!selectedBetType) {
      toast.error("Please select bet type first")
      return
    }

    const max = selectedBetType.maximumNumberOfBalls
    const min = selectedBetType.minimumNumberOfBalls

    // Randomly decide how many balls to pick (between min and max)
    const randomCount = Math.floor(Math.random() * (max - min + 1)) + min

    // Create pool of available numbers based on pattern
    let availableNumbers: number[] = []

    if (pattern === 'even') {
      // All even numbers from 2 to 90
      availableNumbers = Array.from({ length: 45 }, (_, i) => (i + 1) * 2)
    } else if (pattern === 'odd') {
      // All odd numbers from 1 to 89
      availableNumbers = Array.from({ length: 45 }, (_, i) => i * 2 + 1)
    } else {
      // All numbers from 1 to 90
      availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1)
    }

    // Shuffle and pick random count
    const shuffled = availableNumbers.sort(() => Math.random() - 0.5)
    const selectedNumbers = shuffled.slice(0, randomCount)

    if (isMainBall) {
      setSelectedBalls(selectedNumbers)
    } else {
      setAgainstBalls(selectedNumbers)
    }
  }

  // Quick pick
  const handleQuickPick = () => selectRandomBalls('random')

  // Clear selection
  const clearSelection = () => {
    setSelectedBalls([])
    setAgainstBalls([])
  }

  // Reset bet slip
  const resetBetSlip = () => {
    setSelectedBalls([])
    setAgainstBalls([])
  }

  // Reset all games
  // @ts-ignore
  const resetAllGames = () => {
    resetBetSlip()
    form.reset({ betType: "" })
    setSelectedBetType(null)
    setBetsList([])
  }

  // Handle place bet
  const { handlePlaceBet, loading } = usePlaceBet({
    user,
    betsList,
    selectedGame: selectedGame,
    resetAllGames: () => {
      setBetsList([])
    },
    syncUser
  })

  const handleRemoveItem = (index: number) => {
    const updatedBets = [...betsList]
    updatedBets.splice(index, 1)
    setBetsList(updatedBets)
    toast.success("Bet removed successfully!")
  }

  const handleClearCart = () => {
    setBetsList([])
    toast.success("Cart cleared successfully!")
  }

  const handleSelectedGame = (game: Game) => {
    if (game) {
      setSelectedGame(game)
      form.reset({ betType: "" })
      setSelectedBetType(null)
      setSelectedBalls([])
      setAgainstBalls([])
      setBetsList([])
      const betTypeSelect = document.getElementById("betTypeSelect")
      betTypeSelect?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleResetBetSlips = () => {
    form.reset({ betType: "" })
    setSelectedBalls([])
    setAgainstBalls([])
    const betTypeSelect = document.getElementById("betTypeSelect")
    betTypeSelect?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle pattern selection (All/Even/Odd) with random count
  const handleSelectPattern = (pattern: "all" | "even" | "odd") => {
    if (!selectedGame) {
      toast.error("Please select a game first")
      return
    }

    if (!selectedBetType) {
      toast.error("Please select bet type first")
      return
    }

    const max = selectedBetType.maximumNumberOfBalls
    const min = selectedBetType.minimumNumberOfBalls

    // Randomly decide how many balls to pick (between min and max)
    const randomCount = Math.floor(Math.random() * (max - min + 1)) + min

    // Create pool of available numbers based on pattern
    let numbers: number[] = []

    if (pattern === "all") {
      numbers = Array.from({ length: 90 }, (_, i) => i + 1)
    } else if (pattern === "even") {
      numbers = Array.from({ length: 45 }, (_, i) => (i + 1) * 2)
    } else {
      numbers = Array.from({ length: 45 }, (_, i) => i * 2 + 1)
    }

    // Shuffle and pick random count
    const shuffled = numbers.sort(() => Math.random() - 0.5)
    const limited = shuffled.slice(0, randomCount)

    if (isMainBall) {
      setSelectedBalls(limited)
    } else {
      setAgainstBalls(limited)
    }
  }

  return (
    <section className="py-8 sm:py-12 min-h-screen bg-gradient-to-b from-[#01B1A8] to-[#0185B6]">
      <div className="container mx-auto px-4">
        {/* Game Carousel */}
        {games && (
          <GameCarousel handleSelectedGame={handleSelectedGame} games={games} options={OPTIONS} />
        )}
        <Separator className="my-3" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            {/* Header */}
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
                      <FormControl className="border-2 border-[#0A4B7F] rounded-4xl px-10 text-[#0A4B7F] font-semibold bg-white">
                        <SelectTrigger>
                          <SelectValue placeholder={selectedGame ? "Select bet type" : "Select game first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {betTypes?.map((betType) => (
                          <SelectItem key={betType.betTypeID} value={String(betType.betTypeID)}>
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

            {/* Main/Against Ball Toggle - Only show for AGS */}
            {selectedBetType?.nap === 'AGS' && (
              <div className="flex gap-4 mb-6 justify-center">
                <Button
                  type="button"
                  onClick={() => setIsMainBall(true)}
                  size="sm"
                  className={`h-9 px-6 text-sm font-bold rounded-4xl ${
                    isMainBall
                      ? "bg-white text-[#0A4B7F] border-2 border-white"
                      : "bg-[#0A4B7F] text-white border-2 border-white"
                  }`}
                >
                  Select Main Ball
                </Button>
                <Button
                  type="button"
                  onClick={activateAgainstBall}
                  size="sm"
                  className={`h-9 px-6 text-sm font-bold rounded-4xl ${
                    !isMainBall
                      ? "bg-white text-[#0A4B7F] border-2 border-white"
                      : "bg-[#0A4B7F] text-white border-2 border-white"
                  }`}
                >
                  Select Against Ball
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between flex-wrap gap-4 items-center mb-8">
              <div className="flex gap-1">
                <Button onClick={() => handleSelectPattern("all")} size="sm" type="button" className="h-6 px-4 text-xs bg-[#0A4B7F] text-white">
                  All
                </Button>
                <Button variant="outline" onClick={() => handleSelectPattern("even")} size="sm" type="button" className="h-6 px-4 text-xs bg-transparent border-[#FFF100] text-white">
                  Even
                </Button>
                <Button variant="outline" onClick={() => handleSelectPattern("odd")} size="sm" type="button" className="h-6 px-4 text-xs bg-transparent border-border text-white">
                  Odd
                </Button>

                {favoriteBalls && favoriteBalls.length > 0 && (
                  <Button
                    size="sm"
                    type="button"
                    className="h-6 px-4 text-xs bg-[#0A4B7F] text-white"
                    onClick={() => setOpenDialog(true)}
                  >
                    My special numbers
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  type="button"
                  className="h-6 px-4 text-xs bg-[#0A4B7F] text-[#FFF100]"
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

            {/* Ball Grid */}
            <div className="flex bg-[#1FEFBC] rounded-[20px] shadow-lg p-6">
              <div className="flex flex-wrap gap-4 justify-center rounded-2xl p-2">
                {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => {
                  const isSelected = isMainBall
                    ? selectedBalls.includes(num)
                    : againstBalls.includes(num)

                  return (
                    <Ball
                      key={num}
                      value={num}
                      isSelected={isSelected}
                      className={
                        isSelected
                          ? (isMainBall
                            ? ' text-[#0A4B7F]'
                            : 'bg-red-400 text-white')
                          : ''
                      }
                      onClick={() => selectBall(num)}
                    />
                  )
                })}
              </div>
            </div>

            {/* Bet Slip */}
            <div className="flex justify-center mt-6">
              <BetSlip
                selectedBetType={selectedBetType!}
                setSelectedBetType={setSelectedBetType}
                selectedBalls={selectedBalls}
                bankerBalls={selectedBetType?.code === 'BANKER' ? selectedBalls : []}
                againstBalls={againstBalls}
                selectionMode={isMainBall ? "normal" : "against"}
                collisionCount={0}
                setBetsList={setBetsList}
                setSelectedBalls={setSelectedBalls}
                betLists={betsList}
                selectedGame={selectedGame}
                handleResetBetSlips={handleResetBetSlips}
                setAgainstBalls={setAgainstBalls}
                setBankerBalls={() => {}}
                isMainBall={isMainBall}
              />
            </div>
          </form>
        </Form>
      </div>

      {favoriteBalls && (
        <FavouriteBallDialog
          open={openDialog}
          setOpen={setOpenDialog}
          favoriteBalls={favoriteBalls}
          selectBall={selectBall}
          bankerBalls={selectedBetType?.code === 'BANKER' ? selectedBalls : []}
          againstBalls={againstBalls}
          normalBalls={selectedBalls}
        />
      )}

      {/* Floating Cart Button */}
      <BetCart
        betLists={betsList}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        handlePlaceBet={handlePlaceBet}
        loading={loading}
        selectedGame={selectedGame}
      >
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