import EmailVerificationForm from '@/components/settings/email-verification-form'
import { useUserProfile } from '@/hooks/useUserProfile'
import { maskEmail } from '@/lib/utils'
import {createFileRoute, redirect} from '@tanstack/react-router'
import {toast} from "sonner";
import DataLoader from "@/components/data-loader.tsx";

export const Route = createFileRoute('/_authenticated/settings/verify-email')({
  beforeLoad: ({context}) => {
    if (context.auth.minimalUser?.isVerified) {
      toast.error('Your email is already verified.');
      throw redirect({to: '/profile'});
    }
  },
  component: RouteComponent,
})

function RouteComponent() {

  const { data: user, isFetching } = useUserProfile()

  return (
    <>
      <section className="py-10 sm:py-24 flex justify-center items-center relative overflow-hidden">
        <h3 className="font-montserrat text-lg text-foreground font-bold">
          Email Verification
        </h3>
      </section>

      <section className="pb-8 sm:pb-12">
        <div className="container mx-auto px-4">
          <div className="w-full sm:max-w-md px-4 py-6 space-y-6 bg-background rounded-lg shadow-2xl">
            <p className="text-muted-foreground text-center">
              Enter the verification code sent to ({user && maskEmail(user.email)})
            </p>
            {isFetching || !user ? (
              <DataLoader />
            ) : (
              <EmailVerificationForm />
            )}

          </div>
        </div>

      </section>
    </>
  )
}
