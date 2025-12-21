import { BankDetailForm } from '@/components/settings/bank-details-form'
import { useFetchBanks, useUserProfile } from '@/hooks/useUserProfile'
import { createFileRoute } from '@tanstack/react-router'
import DataLoader from "@/components/data-loader.tsx"

export const Route = createFileRoute('/_authenticated/settings/bank')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isFetching: isUserFetching } = useUserProfile()
  const { data: banks, isFetching: isBanksFetching } = useFetchBanks()

  return (
    <>
      <section className="py-14 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">Bank Details</h3>
      </section>

      {/* === bank details form === */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="text-foreground mb-4">
            Your winnings and referral earnings will be credited into this account
          </div>

          {isUserFetching || isBanksFetching || !user || !banks ? (
            <DataLoader />
          ) : (
            <BankDetailForm user={user} banks={banks} />
          )}
        </div>
      </section>
    </>
  )
}