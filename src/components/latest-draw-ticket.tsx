import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import type { LatestDrawTicketResponse } from '@/types/api'
import { NextButton, PrevButton, usePrevNextButtons } from './embla-carousel-arrow-button'
import LatestDrawCard from './latest-draw-card'
import React from "react";

type PropType = {
  slides: LatestDrawTicketResponse[]
  options?: EmblaOptionsType
}

const LatestDrawTicket = (props: PropType) => {
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
          {slides.map((slide, index) => (
            <div className="embla__slide"  style={{ "--slide-size": "100%" } as React.CSSProperties} key={index}>
              <LatestDrawCard item={slide} />
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

export default LatestDrawTicket;
