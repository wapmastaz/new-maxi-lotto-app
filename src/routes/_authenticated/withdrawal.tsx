import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestWithdrawal } from "@/services/Transactions";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import WithdrawalNotification from "@/components/WithdrawalNotification.tsx";
import UserBalance from "@/components/user/user-balance.tsx";

const withdrawalSchema = z.object({
  amount: z.string().min(1, "Please enter an amount"),
});

export const Route = createFileRoute('/_authenticated/withdrawal')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useUserProfile();
  const [open, setOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<{ amount: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = (values: z.infer<typeof withdrawalSchema>) => {
    setPendingValues(values);
    setOpen(true); // Show dialog for confirmation
  };

  async function handleConfirm() {
    if (!pendingValues) return;
    setOpen(true);
    try {
      setIsLoading(true);
      // send withdrawal to backend
      await requestWithdrawal(Number(pendingValues.amount), user?.customerId);
      toast.success("Withdrawal request submitted successfully!");
      setOpen(false); // ✅ Close manually after success
      form.reset();   // optional
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      // show error toast
      toast.error(error.message || "Failed to request withdrawal.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <section className="py-10 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">
          Withdrawal
        </h3>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 space-y-6">
          <WithdrawalNotification />
          <UserBalance walletBalance={user?.walletBalance ?? 0} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <Field>
                      <FieldLabel htmlFor="amount">
                        Amount to withdraw
                      </FieldLabel>
                      <FormControl>
                        <Input
                          id="amount"
                          type="number"
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FieldError>
                        {form.formState.errors.amount?.message}
                      </FieldError>
                    </Field>
                  </FormItem>
                )}
              />

              <Button type="submit" className="bg-primary-900 px-6">
                Proceed
              </Button>
            </form>
          </Form>
        </div>
      </section>

      {/* ✅ Confirmation Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-poppins">
              You are about to withdraw <b>₦{pendingValues?.amount}</b> from your
              wallet. Please confirm this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-primary-900"
            >
              {isLoading && <Spinner />}
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
