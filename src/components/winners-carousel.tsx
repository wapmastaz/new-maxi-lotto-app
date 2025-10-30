import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { NextButton, PrevButton, usePrevNextButtons } from '@/components/embla-carousel-arrow-button'
import type { WinnerTicket } from '@/types/game'
import WinnerCard from './winner-card'

type PropType = {
  slides: WinnerTicket[]
  options?: EmblaOptionsType
}

const WinnersCarousel = (props: PropType) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((ticket, index) => (
            <div className="embla__slide" key={index}>
              <WinnerCard ticket={ticket} />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton className='text-primary-900' onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton className='text-primary-900' onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

      </div>

    </section>
  )
}

export default WinnersCarousel;
