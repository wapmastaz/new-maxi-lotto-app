import { Skeleton } from "@/components/ui/skeleton"

const GameCardSkeleton = () => {
  return (
    <div className="rounded-lg p-4 gap-4 flex items-center shadow min-w-20 h-20 bg-gray-200">
      <div className="image-container">
        <Skeleton className="h-[38px] w-[38px] rounded" />
      </div>
      <div className="game-details flex flex-col space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
    </div>
  )
}

export default GameCardSkeleton
