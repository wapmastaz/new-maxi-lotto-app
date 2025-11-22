import { createFileRoute } from '@tanstack/react-router'
import {PayoutsHistory} from "@/components/payouts/payouts-history.tsx";

export const Route = createFileRoute('/_authenticated/payouts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <section className="py-10 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">Payouts</h3>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <PayoutsHistory />
        </div>
      </section>
    </>
  )
}
