import {createFileRoute, Link} from '@tanstack/react-router'
import {verifyDeposit} from "@/services/PaymentService.ts";

import {Card, CardContent, CardHeader, CardHeading, CardTitle,} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {DownloadIcon, Share2} from "lucide-react";
import {Image} from "@unpic/react";
import useAuthStore from "@/store/authStore.ts";
import {useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";

export const Route = createFileRoute(
  '/_authenticated/deposit/verify/$depositId',
)({
  loader: async ({ params }) => {
    const reference = params.depositId
    const response = await verifyDeposit(reference)
    if (!response) {
      throw new Error("Payout not found")
    }

    return response;
  },
  component: RouteComponent,
})

function RouteComponent() {
  const response = Route.useLoaderData()

  const { syncUser } = useAuthStore((state) => state)
  const queryClient = useQueryClient()

  // Run side effects ONLY once when response changes
  useEffect(() => {
    const updateUser = async () => {
      if (response?.statusCode) {
        await queryClient.invalidateQueries({ queryKey: ['userProfile'] })
        await syncUser() // wait for it to finish
      }
    }
    void updateUser()
  }, [response?.statusCode])

  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">

          <Card className="bg-primary-900" variant="default">
            <CardHeader className="p-6 flex flex-col w-full items-center text-center gap-4">
              <Image src="/success-icon.png" alt="success-icon" width={50} height={50}/>
              <CardHeading>
                <CardTitle className="text-background font-semibold text-xl font-poppins">
                  Transaction Success!
                </CardTitle>
              </CardHeading>
            </CardHeader>
            <CardContent className="text-background space-y-2">
            </CardContent>
          </Card>

          {/* download and share buttons */}
          <div className="mt-6 flex justify-between gap-4">
            <Button variant="dim" className="text-primary-900 px-6 font-medium font-poppins flex gap-2 items-center">
              <DownloadIcon /> Download
            </Button>
            <Button variant="dim" className="text-primary-900 px-6 font-medium font-poppins flex gap-2 items-center">
              <Share2 /> Share
            </Button>
          </div>

          {/* Go home button */}
          <div className="mt-6">
            <Button size="lg" asChild variant="destructive"
                    className="w-full rounded-3xl text-background font-poppins font-semibold">
              <Link to="/deposit">
                Go to Deposit
              </Link>

            </Button>
          </div>

        </div>
      </section>
    </>
  )
}

