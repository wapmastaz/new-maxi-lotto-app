import { NextButton, PrevButton, usePrevNextButtons } from '@/components/embla-carousel-arrow-button'
import { Button } from '@/components/ui/button';
import { cn, finalImagePath, fullDateTimeFormat, isGameClosed } from "@/lib/utils";
import type { Game } from '@/types/game'
import type { EmblaOptionsType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { DotButton, useDotButton } from '@/components/embla-carousel-dot-circle';
import { Image } from '@unpic/react';

type PropType = {
  games: Game[]
  options?: EmblaOptionsType,
  className?: string,
  handleSelectedGame: (game: Game) => void
}

const GameCarousel: React.FC<PropType> = (props) => {

  const { games, options, handleSelectedGame } = props

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: false }), Autoplay({ playOnInit: true, delay: 4000 })
  ])
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

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


  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {games.map((game) => (
            <div className="embla__slide" key={game.gameID}>
              <div
                className={cn("rounded-lg p-4 gap-4 flex items-center justify-between shadow min-w-20 h-20 bg-background")}>
                <div className="flex gap-4">
                  <div className="image-container">
                    <Image src={finalImagePath(game.gameBackgroundImageUrl)} alt={game.gameName} width={38} height={38}
                      className="rounded object-fill" />
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
                  <Button type="button" size="md" onClick={() => handleSelectedGame(game)} className="w-full bg-primary-900 px-4 h-9 text-background rounded-full hover:opacity-80" disabled={isGameClosed(game.endDateTime)}>
                    Play Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
        <div className="embla__dots flex gap-1">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              index={index}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameCarousel
