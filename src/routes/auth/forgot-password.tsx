import ForgotPasswordForm from '@/components/auth/forgot-password-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="bg-white flex flex-col px-4 items-center space-y-5">

      <h1 className="text-base font-extrabold">Forgot password</h1>

      {/* Form */}
      <div className="w-full sm:max-w-md px-4 py-6 bg-white rounded-lg shadow-2xl">
        <ForgotPasswordForm />
      </div>
    </section>
  )
}
