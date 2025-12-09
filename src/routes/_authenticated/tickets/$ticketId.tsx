import {createFileRoute, Link} from '@tanstack/react-router'
import {fetchTicketById} from "@/services/GameService.ts";
import {Card, CardContent, CardFooter, CardHeader, CardHeading, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DownloadIcon, Share2} from "lucide-react";
import {formatCurrency, fullDateTimeFormat} from "@/lib/utils.ts";
import Ball from "@/components/ball.tsx";

export const Route = createFileRoute('/_authenticated/tickets/$ticketId')({
  loader: async ({params}) => {
    const id = Number(params.ticketId)
    return await fetchTicketById(id)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const ticket = Route.useLoaderData();
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <>
            <Card className="bg-primary-900" variant="default">
              <CardHeader className="p-6 flex flex-col w-full items-center text-center gap-4">
                <CardHeading>
                  <CardTitle className="text-background font-semibold text-xl font-poppins">
                    Ticket Details
                  </CardTitle>
                  <p className="text-background text-xs font-poppins font-medium">
                    {fullDateTimeFormat(ticket.dateRegistered)}
                  </p>
                </CardHeading>
              </CardHeader>
              <CardContent className="text-sm text-background space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold">Registration Date:</span>
                  <span className="text-foreground-muted">
                    {fullDateTimeFormat(ticket.dateRegistered)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Game:</span>
                  <span className="text-foreground-muted">
                    {ticket.game.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Stake Amount:</span>
                  <span className="text-foreground-muted">
                    {formatCurrency(ticket.amount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Status:</span>
                  <span className="text-foreground-muted">
                    {ticket.status ? ticket.status.name : "Pending"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Won Amount:</span>
                  <span className="text-foreground-muted">
                   {formatCurrency(ticket.wonAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Bet Type:</span>
                  <span className="text-foreground-muted">
                   {ticket.wonAmount}
                  </span>
                </div>

              </CardContent>
              <CardFooter
                className="items-start text-background text-sm flex-col py-4">
                <h4 className="mb-4 font-medium text-sm font-poppins">
                  BetSlips
                </h4>
                {/*  loop through tickets.betslips*/}
                {!!ticket.betslips.length && ticket.betslips.map((betslip) => {

                  return (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold">Bet Type:</span>
                          <span className="text-foreground-muted">
                          {betslip.betType.code}
                        </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="font-bold">Stake Per Line:</span>
                          <span className="text-foreground-muted">
                          {betslip.stakePerLine}
                        </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="font-bold">Status:</span>
                          <span className="text-foreground-muted">
                          {betslip.status.name}
                        </span>
                        </div>

                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">Bet 1:</span>
                        <div
                          className="flex flex-wrap gap-2">
                          {!!betslip.bet1 && betslip.bet1.map((ball) => (
                            <Ball className="h-9 w-9" value={ball}/>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">Bet 2:</span>
                        <div
                          className="flex flex-wrap gap-2">
                          {!!betslip.bet2 && betslip.bet2.map((ball) => (
                            <Ball className="size-9" value={ball}/>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardFooter>
            </Card>

            {/* download and share button */}
            <div className="mt-6 flex justify-between gap-4">
              <Button variant="dim" className="text-primary-900 px-6 font-medium font-poppins flex gap-2 items-center">
                <DownloadIcon/>
                Download
              </Button>
              <Button variant="dim" className="text-primary-900 px-6 font-medium font-poppins flex gap-2 items-center">
                <Share2/> Share
              </Button>
            </div>

            {/* Go home button */}
            <div className="mt-6">
              <Button size="lg" asChild variant={"destructive"}
                      className="w-full rounded-3xl text-background font-poppins font-semibold">
                <Link to="/tickets">
                  Go to Tickets
                </Link>
              </Button>
            </div>

          </>

        </div>
      </section>
    </>
  )
}
