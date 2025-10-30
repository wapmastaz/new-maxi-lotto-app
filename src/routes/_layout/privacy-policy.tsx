import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/_layout/privacy-policy')({
  component: RouteComponent,
})

const dataWeCollect = [
  "Account details (including KYC when required)",
  "Contact details you choose to share",
  "Usage data (pages visited, device type)",
  "Transactions (deposits, stakes, wins, withdrawals)"
];

const whyWeUseData = [
  "Run your account and process tickets/payments",
  "Security and fraud prevention",
  "Improve site performance and features",
  "Meet legal and regulatory obligations"
];

function RouteComponent() {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container">
          <div className="grid lg:grid-cols-1 items-start gap-16 p-0 mx-auto max-w-5xl max-lg:max-w-2xl">
            <div>
              <h2 className="text-slate-900 text-2xl font-bold">Privacy Policy</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">Last updated: [{new Date().getFullYear()}]</p>
              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">Who we are: MaxiLotto is a brand of LukzerNet Nigeria Limited.</h2>
              </div>

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">Data we collect:</h2>
                <ul className="flex flex-col mt-2 space-x-4 space-y-1">
                  {dataWeCollect.map((item, index) => (
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

              <div className="mt-8">
                <h2 className="text-slate-900 text-base font-semibold">Why we collect it:</h2>
                <ul className="flex flex-col mt-2 space-x-4 space-y-1">
                  {whyWeUseData.map((item, index) => (
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

              <div className="mt-8 space-y-4">
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Cookies & tracking:</strong> Essential and functional cookies help keep you signed in and improve performance. Manage cookies in your browser settings.
                </p>

                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Sharing your data:</strong> With service providers (payments, KYC, security, analytics), regulators when required by law, and affiliates within LukzerNet Nigeria Limited. We do not sell personal data.
                </p>

                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Storage & retention:</strong> Processed in Nigeria and, when needed, securely in other locations by trusted providers; kept only as long as necessary for legal and operational reasons.
                </p>

                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Your choices:</strong> Update your profile, request account closure, manage cookies, and use self-exclusion.
                </p>

                <p className="text-[15px] text-slate-600 leading-relaxed">
                  <strong>Security:</strong> We use encryption and access controls, and we continuously improve our safeguards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
