import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {Check} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

const FormSchema = z.object({
  email: z.string().check(z.email('Please enter a valid email address.')),
});

export default function NewsLetter() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = () => {
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <Check />
        </AlertIcon>
        <AlertTitle>Your form has been successfully submitted</AlertTitle>
      </Alert>
    ));
  };

  // const handleReset = () => {
  //   form.reset();
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-80 space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Email address"
                  className="placeholder:text-gray-600 h-12 text-gray-700 bg-white rounded-[420px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="font-bold font-poppins text-lg w-full bg-[#FF005C] h-12 rounded-[42px]">
          Subscribe
        </Button>
      </form>
    </Form>
  );
}
