import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/_layout/terms-and-condition')({
  component: RouteComponent,
})

const termsAndConditions = [
  "18+ only; KYC may be required, especially for withdrawals.",
  "One account per person; personal use only.",
  "Winnings are credited automatically; larger payouts may require verification.",
  "Fraud or promo abuse may result in suspension and forfeiture.",
  "Nigerian law applies.",
  "Rules and promos can change; check the site for the latest."
];


function RouteComponent() {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container">
          <div className="grid lg:grid-cols-1 items-start gap-16 p-0 mx-auto max-w-5xl max-lg:max-w-2xl">
            <div>
              <h2 className="text-slate-900 text-2xl font-bold">Terms and Conditions</h2>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">Quick Terms You Should Know:</h2>
                <ul className="flex flex-col mt-2 space-x-4 space-y-1">
                  {termsAndConditions.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <div
                        className="flex w-7 h-7 shrink-0 items-center justify-center text-primary-900 font-medium">
                        <ChevronRight />
                      </div>
                      <p className="text-[15px] text-slate-600 leading-relaxed">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
