import {
  useCallback,
  useEffect,
  useState,
  type ComponentPropsWithRef
} from 'react'
import type { EmblaCarouselType } from 'embla-carousel'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

type PropType = ComponentPropsWithRef<'button'>

export const PrevButton = (props: PropType) => {
  const { children, ...restProps } = props

  return (
    <Button
      className="size-icon rounded-full"
      variant={"outline"}
      type="button"
      size={"icon"}
      {...restProps}
    >
      <ChevronLeft size={20} />
      {children}
    </Button>
  )
}

export const NextButton = (props: PropType) => {
  const { children, ...restProps } = props

  return (
    <Button
      className="size-icon rounded-full"
      variant={"outline"}
      type="button"
      size={"icon"}
      {...restProps}
    >
      <ChevronRight size={20} />
      {children}
    </Button>
  )
}
