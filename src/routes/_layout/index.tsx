import { createFileRoute, Link } from '@tanstack/react-router'
import { useFetchDailyGames, useFetchLatestDraw, useFetchTopWinner } from '@/hooks/useGames'
import { Button } from '@/components/ui/button'
import { Image } from '@unpic/react'
import { Marquee } from '@/components/ui/marquee'
import GameCard from '@/components/game-card'
import GameCardSkeleton from '@/components/game-card-skeleton'
import { Spinner } from '@/components/ui/spinner'
import LatestDrawTicket from '@/components/latest-draw-ticket'
import { cn } from '@/lib/utils'
import FaqData from '@/components/faq-data'
import WinnersCarousel from '@/components/winners-carousel'

export const Route = createFileRoute('/_layout/')({
  component: App,
})

function App() {

  const { data: games, isLoading } = useFetchDailyGames()

  const { data: latestDraws, isLoading: latestDrawsLoading } = useFetchLatestDraw()

  const { data: lastFourWinners } = useFetchTopWinner()
  return (
    <>
      <section className="flex container mx-auto px-4 justify-center relative py-8 overflow-hidden">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-primary-900">
            Big Wins <span className="font-normal">Start with</span> One Game
          </h1>
          {/* play now */}
          <Button asChild className="bg-rose-500 hover:bg-rose-700 text-xl rounded-full sm:text-2xl" size={"lg"}>
            <Link to="/play" className="text-background">
              Play Now
            </Link>
          </Button>
        </div>

        <div className="flex">
          <Image src={"/hero-bg.png"} alt="Hero Background" width={500} height={500} className="rounded " />
        </div>
      </section>

      {/*=== games section === */}
      <section className="pb-8">
        <div className="relative flex w-full flex-col items-center justify-center gap-1 overflow-hidden">
          {isLoading && (
            <Marquee pauseOnHover repeat={3} className="[--duration:160s]">
              {[...Array(5)].map((_, index) => (
                <GameCardSkeleton key={index} />
              ))}
            </Marquee>
          )}

          {games && (
            <>
              <Marquee pauseOnHover repeat={3} className="[--duration:160s]">
                {games.map((review) => (
                  <GameCard key={review.gameID} name={review.gameName} image={review.gameImageUrl || undefined} />
                ))}
              </Marquee>

              <Marquee pauseOnHover reverse repeat={3} className="[--duration:160s]">
                {games.map((review) => (
                  <GameCard key={review.gameID} name={review.gameName} image={review.gameImageUrl || undefined} />
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
            <Spinner />
          )}

          {latestDraws && (
            <LatestDrawTicket slides={latestDraws} options={{ slidesToScroll: 1, containScroll: 'trimSnaps', align: 'start' }} />
          )}

        </div>
      </section>

      {/* === WINNERS section === */}
      <section className="pb-8 sm:pb:16">
        <div className="container">
          <div className="flex space-y-6 items-center justify-between mb-4">
            <h2 className="text-2xl mb-0 font-semibold text-primary-900">Top Winners</h2>

            {/* see all */}
            <Button asChild className="text-sm text-muted-foreground" variant={"ghost"}>
              <Link to={"/"} className="text-background">
                See All
              </Link>
            </Button>
          </div>

          <WinnersCarousel slides={lastFourWinners} options={{ slidesToScroll: 1, containScroll: 'trimSnaps', align: 'center', loop: true }} />
        </div>
      </section>

      {/* === FAQ section === */}
      <section className="pb-8 sm:pb:16">
        <div className="container">
          <div className="flex flex-col space-y-6 justify-center">
            <h2 className="text-2xl font-bold text-center text-primary-900">FAQ</h2>
            <FaqData />
          </div>
        </div>
      </section>

    </>
  )
}
