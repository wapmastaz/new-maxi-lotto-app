import {
  type ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState
} from 'react'
import type { EmblaCarouselType } from 'embla-carousel'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void,
  index?: number
}

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick
  }
}

type PropType = ComponentPropsWithRef<'button'> & {
  index?: number;
};

export const DotButton: React.FC<PropType> = (props) => {
  const { index, children, ...restProps } = props

  return (
    <Button size={"icon"} className={cn("size-2 rounded-full", index === 0 ? 'bg-ocean-500' : 'bg-gray-300')}
      variant={"outline"} type="button" {...restProps}>
      {children}
    </Button>
  )
}
