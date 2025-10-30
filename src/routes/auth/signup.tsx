import SignUpForm from '@/components/auth/sign-up-form'
import { createFileRoute } from '@tanstack/react-router'
import { Image } from '@unpic/react'

export const Route = createFileRoute('/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="bg-background flex flex-col items-center pt-8 space-y-5">
      <h1 className="text-base font-extrabold">Sign Up</h1>

      <div className="logo">
        <Image src="/auth/signup.png" alt="logo" width={193} height={84} />
      </div>

      <div className="w-full sm:max-w-md px-4 py-6 bg-background rounded-lg">
        <SignUpForm />
      </div>
    </section>
  )
}
