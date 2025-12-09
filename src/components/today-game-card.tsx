import type {Game} from "@/types/game.ts";
import {Button} from "@/components/ui/button.tsx";
import Countdown from "@/components/count-down.tsx";
import {Image} from "@unpic/react";
import {cn, finalImagePath, isGameClosed} from "@/lib/utils.ts";

interface TodayGameCardProps {
  game: Game
  className?: string
  isEven: boolean
}

const LatestDrawCard = ({ game, isEven
                        }: TodayGameCardProps) => {

  return (
    <div className={cn("relative grid grid-cols-1 overflow-hidden gap-4 rounded-[20px] p-6 shadow-2xl max-w-md mx-auto", isEven ? "bg-primary-900 " : "bg-[#FFE84A]")}>

      {/* Header section */}
      <div className="flex flex-col gap-4 items-start justify-start">
        <div className="flex items-start space-x-2">
          <div className="flex flex-col gap-2">
            <div className="image-container flex justify-center">
              <Image src={finalImagePath(game.gameBackgroundImageUrl)} alt={game.gameName} width={67} height={67}
                     className="rounded object-fill" />
            </div>
            <h3 className={cn("font-bold text-lg truncate text-center", isEven ? "text-[#FFE84A]" : "text-bgColor")}>
              {game.gameName}
            </h3>
            <div className="flex flex-col">
              <div className="text-foreground text-sm text-center truncate">
                Next Draw in: <span><Countdown targetDate={game.endDateTime} /></span>
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="button" size="md" className={cn("w-fit  px-4 h-9 text-background rounded-full hover:opacity-80", isEven ? "bg-[#FFE84A] text-bgColor " : "bg-primary-900 text-white")} disabled={isGameClosed(game.endDateTime)}>
                Play Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestDrawCard;