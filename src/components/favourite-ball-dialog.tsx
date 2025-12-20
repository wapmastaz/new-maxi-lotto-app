import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import type { User } from "@/types/user"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updateFavouriteBall } from "@/services/UserService"
import { useQueryClient } from "@tanstack/react-query"
import Ball from "@/components/ball.tsx"

interface FavouriteBallDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  currentUser: User
  favouriteBalls?: number[]
}

export function FavouriteBallDialog({ open, setOpen, favouriteBalls, currentUser }: FavouriteBallDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBalls, setSelectedBalls] = useState<number[]>(favouriteBalls || [])

  const queryClient = useQueryClient()

  // Sync selectedBalls with favouriteBalls prop when it changes
  useEffect(() => {
    if (favouriteBalls) {
      setSelectedBalls(favouriteBalls)
    }
  }, [favouriteBalls])

  // Reset selectedBalls when dialog opens
  useEffect(() => {
    if (open && favouriteBalls) {
      setSelectedBalls(favouriteBalls)
    }
  }, [open, favouriteBalls])

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
      await updateFavouriteBall(currentUser.customerId, selectedBalls)
      await queryClient.invalidateQueries({queryKey: ['favourite_balls']})

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
        <DialogHeader className="text-left space-y-2">
          <DialogTitle className="font-semibold">Update Favourite Balls</DialogTitle>
          <span className="text-primary-900 font-medium text-xs">
            {selectedBalls.length} {selectedBalls.length > 1 ? 'balls' : 'ball'} selected
          </span>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-sm">
          {/* Ball grid */}
          <ScrollArea className="h-[45vh] w-full">
            <div className="flex flex-wrap gap-4 rounded-2xl p-2">
              {Array.from({ length: 90 }, (_, index) => index + 1).map((ball) => (
                <Ball
                  key={ball}
                  value={ball}
                  isSelected={selectedBalls.includes(ball)}
                  onClick={() => handleSelectBall(ball)}
                  className="border rounded-full border-primary-900"
                />
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