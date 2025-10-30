import { createFileRoute } from '@tanstack/react-router'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Image } from '@unpic/react'
import { useFetchDailyGames } from '@/hooks/useGames'
import * as _ from 'lodash';

import { Spinner } from '@/components/ui/spinner'
import { cn, formatDateToMonthDay, formattedDate, isGameClosed } from '@/lib/utils'
import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react'

export const Route = createFileRoute('/_layout/games')({
  component: RouteComponent
})

function RouteComponent() {

  const { data: games, isLoading } = useFetchDailyGames()

  const groupGamesByDate = _.groupBy(games, 'date');

  console.log("grouped", groupGamesByDate);
  return (
    <>
      <section className="py-14 mb-10 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">Games</h3>
        <Image src="/games-bg.png" alt="Games Background" width={148} height={143} priority className="rounded absolute right-1 top-0" />
      </section>

      <section className="container px-4 mx-auto">

        {isLoading && (
          <Spinner />
        )}

        {groupGamesByDate && Object.keys(groupGamesByDate).map((game, index) => (
          <Accordion
            key={index}
            type="single"
            collapsible
            className="w-full"
            defaultValue={`item-${index}`}
          >
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="flex items-center gap-5">
                <div className="flex items-center gap-4">
                  {/* Icon container */}
                  <div className="h-full items-center">
                    <Image src="/game.png" alt="Game" width={38} height={38} priority className="rounded" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 py-2">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {formattedDate(game)}
                    </h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {/* Map through games of the specific date */}
                {groupGamesByDate[game].map((game: { endDateTime: string; gameName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
                  <div key={index} className="rounded-lg shadow-xs border border-gray-50 overflow-hidden max-w-sm">
                    <button type="button" className={cn("flex items-center gap-4", isGameClosed(game.endDateTime) ? "opacity-50 cursor-not-allowed" : "")} disabled={isGameClosed(game.endDateTime)}>
                      {/* Icon container */}
                      <div className="h-full items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <Image src="/game.png" alt="Game" width={38} height={38} priority className="rounded" />
                        </div>
                      </div>

                      {/* Content */}

                      <div className="flex-1 min-w-0 py-2 text-left">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {game.gameName}
                        </h3>
                        <small className="text-[#C4C4C4]">Guaranteed Prize Pool</small>
                        <p className="text-sm text-foreground-muted">Starts when full</p>
                        {/* Stats row */}
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-orange-500 font-medium">{formatDateToMonthDay(game.endDateTime)}</span>
                          <span className="text-[#C4C4C4] font-semibold ">• in 4 mins</span>
                        </div>
                        {/* Bottom info */}
                        {/* <div className="text-sm">
                        <div className="flex justify-start items-center text-[#64CBF0]">
                          <span>My Plays: 0/3</span>
                          <span className="font-medium">Play ₹4 100</span>
                        </div>
                      </div> */}
                      </div>
                    </button>
                  </div>
                ))}



              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </section>
    </>
  )
}
