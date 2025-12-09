import {createFileRoute, Link} from '@tanstack/react-router'
import {useFetchDailyGames, useFetchLatestDraw, useFetchTopWinner } from '@/hooks/useGames'
import {Button} from '@/components/ui/button'
import {Marquee} from '@/components/ui/marquee'
import GameCard from '@/components/game-card'
import GameCardSkeleton from '@/components/game-card-skeleton'
import {Spinner} from '@/components/ui/spinner'
import LatestDrawTicket from '@/components/latest-draw-ticket'
import {cn, formatCurrency} from '@/lib/utils'
import TodayGameSlider from "@/components/today-games-slider.tsx";
import type {EmblaOptionsType} from "embla-carousel";
import {ChevronRight} from "lucide-react";
import {Image} from "@unpic/react"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

export const Route = createFileRoute('/_layout/')({
  component: App,
})

interface whyCooseUsProps {
  id: number,
  title: string,
  description: string
}

const whyCooseUs: whyCooseUsProps[] = [
  {
    id: 1,
    title: "How to play",
    description: "Want to learn how to play?"
  },
  {
    id: 2,
    title: "join us",
    description: "Why wait, join us now"
  },
  {
    id: 3,
    title: "fund your wallet",
    description: "Use any of our payment options to put money in your wallet"
  },
  {
    id: 4,
    title: "Check your win",
    description: "Check your wins"
  }
];

function App() {

  const {data: games, isLoading} = useFetchDailyGames()

  const {data: latestDraws, isLoading: latestDrawsLoading} = useFetchLatestDraw()

  const {data: latestWinner} = useFetchTopWinner()

  const today = new Date().toISOString().split("T")[0];

  const todaysGames = games?.filter(game => {
    const gameDate = game.date.split("T")[0];
    return gameDate === today;
  });

  const OPTIONS: EmblaOptionsType = {align: 'start'}

  return (
    <>
      <section className="relative flex h-74 bg-[url('/new-bg.png')] bg-cover bg-center py-16 overflow-hidden">
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="container relative z-10">
          <div className="flex flex-col space-y-4 max-w-64">
            <h1 className="text-3xl sm:text-5xl font-bold text-white">
              Big Wins <span className="font-normal">Start with</span> One Game
            </h1>

            <Button
              asChild
              className="bg-rose-500 w-fit px-10 hover:bg-rose-700 text-base font-black rounded-full sm:text-2xl"
              size={"lg"}
            >
              <Link to="/play" className="text-background">
                Play Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/*=== games section === */}
      <section className="pb-8 relative bg-primary-900">
        <div className="relative flex w-full flex-col -top-2  items-center justify-center gap-1">
          {isLoading && (
            <Marquee pauseOnHover repeat={3} className=" [--duration:160s]">
              {[...Array(5)].map((_, index) => (
                <GameCardSkeleton key={index}/>
              ))}
            </Marquee>
          )}

          {games && (
            <>
              <Marquee pauseOnHover repeat={3} className="[--duration:160s]">
                {games.map((review) => (
                  <GameCard key={review.gameID} name={review.gameName} image={review.gameImageUrl || undefined}/>
                ))}
              </Marquee>

              <Marquee pauseOnHover reverse repeat={3} className="[--duration:160s]">
                {games.map((review) => (
                  <GameCard key={review.gameID} name={review.gameName} image={review.gameImageUrl || undefined}/>
                ))}
              </Marquee>
            </>
          )}
        </div>
      </section>

      {/* === Latest Draw === */}
      <section className="py-8 mb-8 sm:py-12 bg-[url('/latest-draw-bg.png')] bg-cover bg-center">
        <div className={cn("container mx-auto px-4")}>
          <h2 className="text-2xl font-bold text-white mb-4">Latest Draw</h2>
          {/* <LatestDraw /> */}
          {latestDrawsLoading && (
            <Spinner/>
          )}

          {latestDraws && (
            <LatestDrawTicket slides={latestDraws}
                              options={{slidesToScroll: 1, containScroll: 'trimSnaps', align: 'start'}}/>
          )}

        </div>
      </section>


      {/*=== Today's Game ===*/}
      <section className="py-8 sm:py:16">
        <div className="container">
          <div className="space-y-2 mb-6 text-center">
            <h2 className="text-lg mb-0 font-bold uppercase text-bgColor">Today’s games</h2>
            <p className="text-xs text-slate-600 leading-relaxed capitalize">You could be our next winner</p>
          </div>
        </div>
        {/* Today's game slider*/}
        {todaysGames && <TodayGameSlider options={OPTIONS} slides={todaysGames}/>}

        <div className="flex justify-center mt-6">
          <Link to="/games" className="text-sm flex items-center justify-center gap-2">
            View all games
            <ChevronRight className="text-primary-900"/>
          </Link>
        </div>

      </section>

      <section className="bg-gradient-to-b overflow-hidden py-8 sm:py-16 relative from-[#01B1A8] to-[#0185B6]">
        <div className="container">
          <div className="flex justify-center relative left-1 -top-24">
            <Image src="/games-bg.png" alt="Games Background" width={310} height={211} priority
                   className="rounded "/>
          </div>

          <div className="space-y-6 relative -mt-40 max-w-xs mx-auto">
            {whyCooseUs.map(({id, title, description}) => (
              <div className="h-60 rounded-[20px] p-12 bg-white space-y-4" key={id}>
                <h3 className="text-xl text-bgColor font-bold">{title}</h3>
                <p className="text-sm text-bgColor font-medium leading-relaxed capitalize">{description}</p>
                <Button asChild size="md"
                        className="w-fit bg-primary-900 px-4 h-9 text-background rounded-full hover:opacity-80">
                  <Link to="/play">Play Now!</Link>
                </Button>
              </div>
            ))}

          </div>
        </div>
      </section>

      <section className="py-8 sm:py:16">
        <div className="container">
          <div className="space-y-2 mb-6 flex justify-between">
            <h2 className="text-lg mb-0 font-bold uppercase text-bgColor">Recent Winners</h2>
            <Link to="/" className="text-xs text-slate-600 leading-relaxed capitalize">
              See All
            </Link>
          </div>

          <div className="flex w-full max-w-lg flex-col gap-6">
            {latestWinner && latestWinner.map((winner, index: number) => (
              <Item key={index} variant="default" className="p-0">

                <div className="flex size-14 justify-center items-center rounded-full bg-[#FF005C]">
                  <Image src="winner-trophy.png" alt="Winner Trophy" width={33} height={33} />
                </div>

                <ItemContent className="bg-gray-100 p-2 px-12 rounded-4xl">
                  <ItemTitle className="font-normal text-sm">
                    {winner.name}
                  </ItemTitle>

                  <ItemDescription className="font-semibold text-bgColor text-sm">
                    {formatCurrency(winner.wonAmount)}
                  </ItemDescription>
                </ItemContent>

              </Item>
            ))}
          </div>

        </div>

      </section>

    </>
  )
}
