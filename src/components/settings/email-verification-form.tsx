import { useState } from 'react'

import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { verifyUserEmailToken } from '@/services/UserService';

const withdrawalSchema = z.object({
  token: z.string().min(1),
});

const EmailVerificationForm = () => {

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof withdrawalSchema>) => {

    try {
      setIsLoading(true);

      const response = await verifyUserEmailToken(values.token);

      if (response == "invalid OTP") {
        toast.error("Invalid OTP");
      } else {
        toast.success("Email verified successfully");
        // reset form
        form.reset();
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }

  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="token">
                  Enter Verification Code
                </FieldLabel>
                <FormControl>
                  <Input
                    id="token"
                    type="text"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FieldError>
                  {form.formState.errors.token?.message}
                </FieldError>
              </Field>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}
          className="w-full mb-4 bg-accent-2-900 text-background text-sm rounded-2xl uppercase hover:opacity-70 hover:bg-primary">
          {isLoading ? <Spinner className="animate-spin size-4" /> : null}
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>
    </Form>
  )
}

export default EmailVerificationForm