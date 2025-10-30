import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import type { User } from "@/types/user"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updateFavouriteBall } from "@/services/UserService"
import { useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

interface FavouriteBallDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  user: User
  favouriteBalls: number[]
}

export function FavouriteBallDialog({ open, setOpen, favouriteBalls, user }: FavouriteBallDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBalls, setSelectedBalls] = useState<number[]>(favouriteBalls || [])

  const queryClient = useQueryClient();

  // toggle selection of a ball
  const handleSelectBall = (ball: number) => {
    setSelectedBalls(prev =>
      prev.includes(ball) ? prev.filter(b => b !== ball) : [...prev, ball]
    )
  }

  const updateFavouriteBalls = async () => {
    try {
      if (selectedBalls.length === 0) {
        toast.error("Please select at least one favourite ball")
        return
      }
      setIsLoading(true)
      await updateFavouriteBall(user.customerId, selectedBalls)
      // 🔹 Replace this with your API call
      // console.log("Selected Favourite Balls:", selectedBalls)
      queryClient.invalidateQueries({ queryKey: ['favourite_balls'] })

      toast.success("Favourite balls updated successfully!")
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:mx-auto max-w-[95%] sm:max-w-xl mx-auto bg-background p-4 rounded">
        <DialogHeader className="text-left">
          <DialogTitle className="font-semibold">Update Favourite Balls</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-sm">
          {/* Ball grid */}
          <ScrollArea className="h-[45vh] w-full ">
            <div className="flex flex-wrap gap-4 rounded-2xl p-2">
              {Array.from({ length: 90 }, (_, index) => index + 1).map((ball) => (
                <button
                  key={ball}
                  onClick={() => handleSelectBall(ball)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium transition",
                    selectedBalls.includes(ball)
                      ? "bg-primary-900 text-white border-primary-900"
                      : "bg-background text-primary-900 border-border hover:bg-gray-100"
                  )}
                >
                  {ball}
                </button>
              ))}
            </div>
          </ScrollArea>
          {/* Submit button */}
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={updateFavouriteBalls}
            className="px-6 py-5 w-full mt-4 uppercase bg-primary-900 text-white flex items-center justify-center gap-2 rounded"
          >
            {isLoading && <Spinner />}
            {isLoading ? "Processing..." : "Update Favourite Balls"}
          </Button>
        </div>


      </DialogContent>
    </Dialog>
  )
}
