import { useState } from 'react'
import { forgotPasswordSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react";
import { requestForgotPassword } from "@/services/AuthService";
import { toast } from "sonner";
import { Link } from '@tanstack/react-router';

const forgotPasswordForm = () => {

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {

    const { email } = values;

    try {
      setLoading(true);
      const response = await requestForgotPassword(email)
      // console.log(response);
      toast.success("Password reset link sent to your email")
      form.reset();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // console.log("error", error);
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false);

    }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription className="text-xs font-medium font-poppins text-muted-foreground">
                We will text you a new password to this email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full bg-accent-2-900 text-white rounded-2xl uppercase hover:opacity-70 hover:bg-primary">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send"}
        </Button>

        {/* sign up */}
        <div className="flex justify-center text-sm font-poppins gap-6">
          <p className="text[#343434]">Remember your account? </p>
          <Link to="/auth/login" className="text-primary-500 font-semibold ml-1 hover:underline">
            Login
          </Link>
        </div>

      </form>
    </Form>
  )
}

export default forgotPasswordForm