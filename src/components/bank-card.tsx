import { type EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton, useDotButton } from '@/components/embla-carousel-dot-circle'
import CreditCard from '@/components/credit-card'
import type { DebitCard } from '@/types/user'

type PropType = {
  debitCards: DebitCard[]
  options?: EmblaOptionsType
}

const BankCard = (props: PropType) => {
  const { debitCards, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {debitCards.map((debitCard, index) => (
            <div className="embla__slide" key={index}>
              <CreditCard bankName={debitCard.bankName} cardNumber={debitCard.accountNumber} expiryDate={debitCard.type} holderName={debitCard.accountName} />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls justify-center flex">
        <div className="embla__dots gap-2 flex justify-center">
          {scrollSnaps.map((_: any, index: any) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BankCard
