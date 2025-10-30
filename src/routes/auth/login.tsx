import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAuthStore from '@/store/authStore'
import { useState } from 'react'

import { loginSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { login } from '@/services/AuthService'

const fallback = '/profile' as const

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {

  const { setAccessToken, setUser } = useAuthStore((state) => state);

  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {

      setLoading(true)
      const { username, password } = values
      const user = await login(username, password)
      // set Token
      setAccessToken(user.token)
      // set user
      setUser(user)
      // redirect
      await navigate({ to: search.redirect || fallback })
      // show toast
      toast.success("Login successful")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // console.log("error", error);
      toast.error(error?.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="bg-background flex relative flex-col items-center pt-8 space-y-5">

      <h1 className="text-base font-extrabold">Sign In</h1>

      <div className="logo flex w-full py-5 left-0">
        <Image src="/auth/login.png" className="" alt="logo" width={342} height={92} />
      </div>

      {/* Form */}
      <div className="w-full sm:max-w-md px-4 py-6 bg-background rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method="post">
            {/* username */}
            <div className="mb-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input type={showPassword ? "text" : "password"}
                          placeholder="Enter password" {...field} />
                        <div onClick={toggleShowPassword}
                          className="absolute right-2 cursor-pointer text-primary">
                          {showPassword ? (
                            <EyeOffIcon size={20} color="#CACACA" />
                          ) : (
                            <EyeIcon size={20} color="#CACACA" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Forgot Password */}
            <div className="flex mb-6 justify-end w-full text-sm text-accent-3-100 hover:underline cursor-pointer">
              <Link to="/auth/forgot-password">
                Forgot your password ?
              </Link>
            </div>

            <Button type="submit" disabled={loading}
              className="w-full mb-4 bg-accent-2-900 text-white text-sm rounded-2xl uppercase hover:opacity-70 hover:bg-primary">
              {loading ? <LoaderCircleIcon className="animate-spin size-4" /> : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* sign up */}
            <div className="flex justify-center text-sm font-poppins gap-6">
              <p className="text[#343434]">Don&apos;t have an account? </p>
              <Link to="/auth/signup" className="text-secondary-900 font-semibold ml-1 hover:underline">
                Sign Up
              </Link>
            </div>

          </form>
        </Form>
      </div>

    </section>
  )
}
