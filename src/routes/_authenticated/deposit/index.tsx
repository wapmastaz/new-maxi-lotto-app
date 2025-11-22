import { createFileRoute } from '@tanstack/react-router'
import {useUserProfile} from "@/hooks/useUserProfile.ts";
import {DepositForm} from "@/components/deposit/deposit-form.tsx";

export const Route = createFileRoute('/_authenticated/deposit/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useUserProfile()

  return (
    <>
      <section className="py-10 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">Deposits</h3>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {user && <DepositForm user={user} />}
        </div>
      </section>
    </>
  )
}
