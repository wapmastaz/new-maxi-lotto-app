import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {EyeIcon, EyeOffIcon} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { signupSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { registerUser } from '@/services/AuthService';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import {Link, useNavigate} from '@tanstack/react-router';
import { useState } from "react";
import {Spinner} from "@/components/ui/spinner.tsx";


const SignUpForm = () => {

  const { setAccessToken, setUser } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword)
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {

      setLoading(true)
      const { username, password, email, phoneNumber } = values
      const user = await registerUser(username, email, password, phoneNumber)
      // set Token
      setAccessToken(user.token)
      // set user
      setUser(user)

      // show toast
      toast.success("Registration successful")

      // redirect
      await navigate({ to: "/profile" })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

      console.log("error", error);
      toast.error(error?.message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Changed to "name" instead of "username" */}
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

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Phone Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                  />
                  <div
                    onClick={toggleShowPassword}
                    className="absolute right-2 cursor-pointer text-primary"
                  >
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...field}
                  />
                  <div
                    onClick={toggleShowConfirmPassword}
                    className="absolute right-2 cursor-pointer text-primary"
                  >
                    {showConfirmPassword ? (
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

        {/* terms and conditions  */}
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-1 space-y-0 rounded-md ">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="size-5"
                />
              </FormControl>
              <div className="space-y-0 text-foreground/70 leading-normal">
                By creating an account your agree to our <Link to={"/terms-and-condition"}
                  className="text-secondary-900 font-medium hover:underline">Term
                  and Conditions</Link>
              </div>

            </FormItem>

          )}
        />

        <FormField
          control={form.control}
          name="ageConsent"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-1 space-y-0 rounded-md ">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="size-5"
                />
              </FormControl>
              <div className="space-y-0 text-foreground/70 leading-normal">
                I confirm that I am at least 18 years old.
              </div>

            </FormItem>

          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-accent-2-900 text-white rounded-2xl font-medium font-poppins uppercase hover:opacity-70 hover:bg-primary"
        >
          {loading && <Spinner/>}
          {loading ? 'Submitting' : "Sign Up"}
        </Button>

        <div className="flex justify-center text-sm font-poppins gap-2">
          <p className="text-accent-3-100">Have an account?</p>
          <Link to="/auth/login" className="text-secondary-900 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default SignUpForm