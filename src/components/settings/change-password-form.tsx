import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff, LoaderCircleIcon } from "lucide-react"
import { updatePassword } from "@/services/UserService"
import { toast } from "sonner"

// ✅ Zod schema for validation
const formSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const { currentPassword, newPassword } = values
      const response = await updatePassword(currentPassword, newPassword)
      console.log("Password updated successfully:", response);
      toast.success("Password updated successfully")
      form.reset()
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password")
    } finally {
      setLoading(false)
    }

  }

  const PasswordInput = ({
    field,
    label,
    toggleKey,
    placeholder,
  }: {
    field: any
    label: string
    toggleKey: "current" | "new" | "confirm"
    placeholder: string
  }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="relative">
        <FormControl>
          <Input
            type={showPassword[toggleKey] ? "text" : "password"}
            placeholder={placeholder}
            {...field}
          />
        </FormControl>
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          onClick={() =>
            setShowPassword((prev) => ({
              ...prev,
              [toggleKey]: !prev[toggleKey],
            }))
          }
        >
          {showPassword[toggleKey] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <FormMessage />
    </FormItem>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <PasswordInput
              field={field}
              label="Current Password"
              toggleKey="current"
              placeholder=""
            />
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <PasswordInput
              field={field}
              label="New Password"
              toggleKey="new"
              placeholder=""
            />
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <PasswordInput
              field={field}
              label="Confirm Password"
              toggleKey="confirm"
              placeholder=""
            />
          )}
        />

        <div className="flex items-center gap-4">
          <Button type="submit" className="w-full bg-primary-900" disabled={loading}>
            {loading ? <LoaderCircleIcon className="animate-spin size-4" /> : null}
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
