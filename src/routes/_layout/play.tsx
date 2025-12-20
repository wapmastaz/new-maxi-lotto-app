import {createFileRoute} from '@tanstack/react-router'
import Ball from "@/components/ball"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useFetchDailyGames, useGetBetTypes} from "@/hooks/useGames"
import {usePlaceBet} from "@/hooks/usePlaceBet"
import useAuthStore from "@/store/authStore"
import {useBetStore} from "@/store/bet-store.ts"
import type {BetType, Game} from "@/types/game"
import {zodResolver} from "@hookform/resolvers/zod"
import type {EmblaOptionsType} from 'embla-carousel'
import {Trash2Icon} from "lucide-react"
import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {z} from "zod"
import {Separator} from "@/components/ui/separator"
import {useFetchFavouriteBalls} from "@/hooks/useUserProfile"
import BetSlip from '@/components/play/bet-slip'
import {FavouriteBallDialog} from '@/components/play/favourite-ball-dialog'
import GameCarousel from '@/components/play/game-carousel'

const FormSchema = z.object({
  betType: z.string().min(1, "Please select a bet type"),
})

const OPTIONS: EmblaOptionsType = {loop: true}

export const Route = createFileRoute('/_layout/play')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedBalls, setSelectedBalls] = useState<number[]>([])
  const [againstBalls, setAgainstBalls] = useState<number[]>([])
  const [isMainBall, setIsMainBall] = useState<boolean>(true)
  const [selectedBetType, setSelectedBetType] = useState<BetType | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const {betsList, selectedGame, addBet, removeBet, clearBets, setSelectedGame} = useBetStore()
  const {minimalUser: user, syncUser} = useAuthStore(state => state)

  const {data: betTypes} = useGetBetTypes()
  const {data: games} = useFetchDailyGames()
  const {data: favoriteBalls} = useFetchFavouriteBalls(user)

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
        // Scroll to bet slip when max reached
        setTimeout(() => {
          document.getElementById("betSlipSection")?.scrollIntoView({behavior: "smooth", block: "center"})
        }, 300)
        return
      }

      setSelectedBalls([...selectedBalls, ball])

      // Scroll to bet slip when reaching maximum
      if (ballLength === selectedBetType.maximumNumberOfBalls) {
        setTimeout(() => {
          document.getElementById("betSlipSection")?.scrollIntoView({behavior: "smooth", block: "center"})
        }, 300)
      }
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
        // Scroll to bet slip when max reached
        setTimeout(() => {
          document.getElementById("betSlipSection")?.scrollIntoView({behavior: "smooth", block: "center"})
        }, 300)
        return
      }

      setAgainstBalls([...againstBalls, ball])

      // Scroll to bet slip when reaching maximum
      if (ballLength === selectedBetType.maximumNumberOfBalls) {
        setTimeout(() => {
          document.getElementById("betSlipSection")?.scrollIntoView({behavior: "smooth", block: "center"})
        }, 300)
      }
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
      availableNumbers = Array.from({length: 45}, (_, i) => (i + 1) * 2)
    } else if (pattern === 'odd') {
      // All odd numbers from 1 to 89
      availableNumbers = Array.from({length: 45}, (_, i) => i * 2 + 1)
    } else {
      // All numbers from 1 to 90
      availableNumbers = Array.from({length: 90}, (_, i) => i + 1)
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
    form.setValue("betType", "", {shouldValidate: false})
    setSelectedBetType(null)
    clearBets()
  }

  // Handle place bet
  const {handlePlaceBet, loading} = usePlaceBet({
    user,
    betsList,
    selectedGame: selectedGame,
    resetAllGames: () => {
      clearBets()
    },
    syncUser
  })

  const handleRemoveItem = (index: number) => {
    removeBet(index)
    toast.success("Bet removed successfully!")
  }

  const handleClearCart = () => {
    clearBets()
    toast.success("Cart cleared successfully!")
  }

  const handleSelectedGame = (game: Game) => {
    if (game) {
      setSelectedGame(game)
      form.setValue("betType", "", {shouldValidate: false})
      setSelectedBetType(null)
      setSelectedBalls([])
      setAgainstBalls([])
      clearBets()
      const betTypeSelect = document.getElementById("betTypeSelect")
      betTypeSelect?.scrollIntoView({behavior: "smooth"})
    }
  }

  const handleResetBetSlips = () => {
    form.setValue("betType", "", {shouldValidate: false})
    setSelectedBalls([])
    setAgainstBalls([])
    const betTypeSelect = document.getElementById("betTypeSelect")
    betTypeSelect?.scrollIntoView({behavior: "smooth"})
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
      numbers = Array.from({length: 90}, (_, i) => i + 1)
    } else if (pattern === "even") {
      numbers = Array.from({length: 45}, (_, i) => (i + 1) * 2)
    } else {
      numbers = Array.from({length: 45}, (_, i) => i * 2 + 1)
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
          <GameCarousel handleSelectedGame={handleSelectedGame} games={games} options={OPTIONS}/>
        )}
        <Separator className="my-3"/>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {
          })}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-lg md:text-3xl font-bold text-white">Play</h1>
              <FormField
                control={form.control}
                name="betType"
                render={({field}) => (
                  <FormItem id="betTypeSelect">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedGame}
                    >
                      <FormControl
                        className="border-2 border-[#0A4B7F] rounded-4xl px-10 text-[#0A4B7F] font-semibold bg-white">
                        <SelectTrigger>
                          <SelectValue placeholder={selectedGame ? "Select bet type" : "Select game first"}/>
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
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>

            {/* Main/Against Ball Toggle - Only show for AGS */}
            {selectedBetType?.nap === 'AGS' && (
              <div className="flex gap-4 mb-6 justify-center">
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMainBall(true)
                  }}
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
                  onClick={(e) => {
                    e.preventDefault();
                    activateAgainstBall()
                  }}
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
                <Button onClick={() => handleSelectPattern("all")} size="sm" type="button"
                        className="h-6 px-4 text-xs bg-[#0A4B7F] text-white">
                  All
                </Button>
                <Button variant="outline" onClick={() => handleSelectPattern("even")} size="sm" type="button"
                        className="h-6 px-4 text-xs bg-transparent border-[#FFF100] text-white">
                  Even
                </Button>
                <Button variant="outline" onClick={() => handleSelectPattern("odd")} size="sm" type="button"
                        className="h-6 px-4 text-xs bg-transparent border-border text-white">
                  Odd
                </Button>

                {favoriteBalls && favoriteBalls.length > 0 && (
                  <Button
                    size="sm"
                    type="button"
                    className="h-6 px-4 text-xs bg-[#0A4B7F] text-white"
                    onClick={() => setOpenDialog(true)}
                  >
                    My Favorite numbers
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
                  <Trash2Icon size={14}/>
                </Button>
              </div>
            </div>

            {/* Ball Grid */}
            <span className="text-white font-semibold flex mb-1 justify-center text-xs">
            {selectedBalls.length} {selectedBalls.length > 1 ? 'balls' : 'ball'} selected
          </span>
            <div className="flex bg-[#1FEFBC] rounded-[20px] shadow-lg p-4">
              <div className="flex flex-wrap gap-4 justify-center rounded-2xl">

                {Array.from({length: 90}, (_, i) => i + 1).map((num) => {
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
            <div className="flex justify-center mt-6" id="betSlipSection">
              <BetSlip
                selectedBetType={selectedBetType!}
                setSelectedBetType={setSelectedBetType}
                selectedBalls={selectedBalls}
                bankerBalls={selectedBetType?.code === 'BANKER' ? selectedBalls : []}
                againstBalls={againstBalls}
                selectionMode={isMainBall ? "normal" : "against"}
                collisionCount={0}
                addBet={addBet}
                setSelectedBalls={setSelectedBalls}
                betLists={betsList}
                selectedGame={selectedGame}
                handleResetBetSlips={handleResetBetSlips}
                setAgainstBalls={setAgainstBalls}
                setBankerBalls={() => {
                }}
                isMainBall={isMainBall}
              />
            </div>
          </form>
        </Form>


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

        {/* Bets List Section - Show added games on the page */}
        {betsList.length > 0 && (
          <div className="mt-8 bg-background rounded-2xl shadow-md w-full max-w-sm" id="gamesListSection">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#0A4B7F]">
                  My Games ({betsList.length})
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-500 border-red-500 hover:bg-red-50"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                {betsList.map((bet, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-[#0185B6] text-white px-3 py-1 rounded-full text-sm font-bold">
                            {bet.betType.code}
                          </div>
                          <span className="text-sm text-gray-500">
                          {selectedGame?.gameName}
                        </span>
                        </div>

                        {/* Display balls based on bet type */}
                        <div className="space-y-2 text-sm">
                          {bet.betType.code === 'BANKER' ? (
                            <div>
                              <span className="font-semibold text-gray-700">Balls: </span>
                              <span className="text-gray-600">
                              {bet.selectedBalls.join(', ')}
                                <span className="font-bold text-[#0A4B7F] ml-2">AG 1-90</span>
                            </span>
                            </div>
                          ) : bet.betType.nap === 'AGS' ? (
                            <>
                              <div>
                                <span className="font-semibold text-gray-700">Main Bets: </span>
                                <span className="text-gray-600">
                                {bet.selectedBalls.join(', ')}
                              </span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">Against Bets: </span>
                                <span className="text-gray-600">
                                {bet.againstBalls.join(', ')}
                              </span>
                              </div>
                            </>
                          ) : (
                            <div>
                              <span className="font-semibold text-gray-700">My Bets: </span>
                              <span className="text-gray-600">
                              {bet.selectedBalls.join(', ')}
                            </span>
                            </div>
                          )}

                          <div className="flex gap-6 mt-3">
                            <div>
                              <span className="font-semibold text-gray-700">Lines: </span>
                              <span className="text-gray-600">{bet.numberOfLines}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Stake: </span>
                              <span className="text-gray-600">₦{bet.stake.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Max Win: </span>
                              <span className="text-green-600 font-bold">
                              ₦{bet.maxWinning.toLocaleString()}
                            </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:bg-red-50 ml-4"
                      >
                        <Trash2Icon size={18}/>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Place Bet Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-700">Total Stake:</span>
                  <span className="text-2xl font-bold text-[#0A4B7F]">
                  ₦{betsList.reduce((sum, bet) => sum + bet.stake, 0).toLocaleString()}
                </span>
                </div>
                <Button
                  type="button"
                  onClick={handlePlaceBet}
                  disabled={loading}
                  className="w-full bg-[#0185B6] text-white rounded-full py-6 text-lg font-bold hover:opacity-90"
                >
                  {loading ? 'Placing Bet...' : 'Place Bet'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}