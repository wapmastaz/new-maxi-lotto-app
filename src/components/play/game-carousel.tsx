import { NextButton, PrevButton, usePrevNextButtons } from '@/components/embla-carousel-arrow-button'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Add this import
import { cn, finalImagePath, fullDateTimeFormat, isGameClosed } from "@/lib/utils";
import type { Game } from '@/types/game'
import type { EmblaOptionsType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Image } from '@unpic/react';
import {useBetStore} from "@/store/bet-store.ts";

type PropType = {
  games: Game[]
  options?: EmblaOptionsType,
  className?: string,
  handleSelectedGame: (game: Game) => void
}

const GameCarousel: React.FC<PropType> = (props) => {

  const { games, options, handleSelectedGame } = props
  const {selectedGame} = useBetStore()

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: false }), Autoplay({ playOnInit: true, delay: 4000 })
  ])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const onButtonAutoplayClick = useCallback(
    (callback: () => void) => {
      const autoScroll = emblaApi?.plugins()?.autoScroll
      if (!autoScroll) {
        return
      }

      const resetOrStop =
        autoScroll.options.stopOnInteraction === false
          ? autoScroll.reset
          : autoScroll.stop

      resetOrStop()
      callback()
    },
    [emblaApi]
  )

  // Helper function to get game timing badge
  const getGameTimingBadge = (endDateTime: string) => {
    const now = new Date()
    const gameEnd = new Date(endDateTime)

    // Reset time to midnight for date comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const gameDate = new Date(gameEnd.getFullYear(), gameEnd.getMonth(), gameEnd.getDate())

    // Calculate difference in days
    const diffTime = gameDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return { label: 'Today', variant: 'outline' as const, className: 'bg-green-500/50 text-green-500 hover:bg-green-600' }
    } else if (diffDays === 1) {
      return { label: 'Tomorrow', variant: 'outline' as const, className: 'bg-blue-500/50 hover:bg-blue-600 text-white' }
    } else if (diffDays === 2) {
      return { label: 'Later', variant: 'outline' as const, className: 'bg-orange-500/50 hover:bg-orange-600 text-white border-orange-500' }
    }

    return null
  }

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {games.map((game) => {
            const timingBadge = getGameTimingBadge(game.endDateTime)

            return (
              <div className="embla__slide" style={{ "--slide-size": "100%" } as React.CSSProperties} key={game.gameID}>
                <div
                  className={cn("rounded-lg p-4 gap-4 flex items-center justify-between shadow min-w-20 h-20 bg-background relative", selectedGame?.gameID === game.gameID ? 'bg-amber-100' : '')}>

                  {/* Badge indicator */}
                  {timingBadge && (
                    <Badge
                      variant={timingBadge.variant}
                      className={cn("absolute top-1 left-1/2 -translate-x-1/2 text-xs font-medium", timingBadge.className)}
                    >
                      {timingBadge.label}
                    </Badge>
                  )}

                  <div className="flex gap-4">
                    <div className="image-container">
                      <Image
                        src={finalImagePath(game.gameBackgroundImageUrl)}
                        alt={game.gameName}
                        width={38}
                        height={38}
                        className="rounded object-fill"
                      />
                    </div>
                    <div className="game-details flex flex-col">
                      <h3 className="font-bold text-sm text-primary-900">{game.gameName}</h3>
                      <p className="text-muted-foreground text-xs font-poppins">
                        {fullDateTimeFormat(game.endDateTime)}
                      </p>
                    </div>
                  </div>

                  {/* play button */}
                  <div className="flex">
                    <Button
                      type="button"
                      size="md"
                      onClick={() => handleSelectedGame(game)}
                      className="w-full bg-primary-900 px-4 h-9 text-background rounded-full hover:opacity-80"
                      disabled={isGameClosed(game.endDateTime)}
                    >
                      {isGameClosed(game.endDateTime) ? 'Closed' : 'Play Now'}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton
            onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onButtonAutoplayClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>
      </div>
    </div>
  )
}

export default GameCarousel