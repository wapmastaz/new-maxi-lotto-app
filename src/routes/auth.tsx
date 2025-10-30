import AuthLayout from '@/components/layouts/auth-layout'
import { createFileRoute, redirect } from '@tanstack/react-router'
import z from 'zod'

const fallback = '/account/profile' as const

export const Route = createFileRoute('/auth')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: AuthLayout,
})

