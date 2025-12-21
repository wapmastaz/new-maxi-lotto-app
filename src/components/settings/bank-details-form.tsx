import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type { Bank, User } from "@/types/user"
import { LoaderCircleIcon } from "lucide-react"
import { toast } from "sonner"
import { resolveAccountDetails, updateBankDetails } from "@/services/UserService"

// ✅ Validation schema
const bankDetailSchema = z.object({
  bank: z.number().min(1, "Bank is required"),
  accountNumber: z.string().min(1, "Account number is required").max(10),
  accountName: z.string().min(1, "Account Name is required")
})


export function BankDetailForm({ user, banks }: { user: User, banks: Bank[] }) {

  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)

  const form = useForm<z.infer<typeof bankDetailSchema>>({
    resolver: zodResolver(bankDetailSchema),
    defaultValues: {
      accountNumber: user.accountNumber ?? "",
      bank: user.bank ?? 0,
      accountName: user.accountName ?? "",
    },
  })


  async function onSubmit(values: z.infer<typeof bankDetailSchema>) {
    try {
      setLoading(true)

      const {accountNumber, bank, accountName} = await updateBankDetails(user.customerId, values.accountName, values.accountNumber, Number(values.bank))
      toast.success("Bank details updated successfully")

        form.reset({
          accountNumber: accountNumber ?? "",
          bank: bank ?? 0,
          accountName: accountName ?? "",
        })

    } catch (error: any) {
      toast.error(error.message || "Failed to update bank details")
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Handle account number validation
  const handleAccountNumberChange = async (value: string) => {
    form.setValue("accountNumber", value)

    if (value.length === 10 && form.getValues("bank")) {
      try {
        setValidating(true)
        const bankCode = form.getValues("bank")
        const { account_name, account_number, bank_id } = await resolveAccountDetails(value, bankCode)

        form.setValue("accountName", account_name)
        form.setValue("accountNumber", account_number)
        form.setValue("bank", bank_id)

        toast.success("Account verified successfully")
      } catch (error: any) {
        toast.error(error.message || "Account validation failed")
        form.setValue("accountName", "")
      } finally {
        setValidating(false)
      }
    } else {
      form.setValue("accountName", "")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Bank</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))} // store as number
                  value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {banks?.map((bank) => (
                      <SelectItem key={bank.id} value={String(bank.id)}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=""
                    value={field.value ?? ""}
                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input readOnly  {...field} />
                </FormControl>
                <FormDescription>
                  {validating ? "Validating account..." : "Account name will populate"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full bg-primary-900" disabled={loading}>
          {loading ? <LoaderCircleIcon className="animate-spin size-4" /> : null}
          {loading ? "Updating..." : "Update Bank"}
        </Button>
      </form>
    </Form>
  )
}
