import type {Game} from "@/types/game.ts";
import {Button} from "@/components/ui/button.tsx";
import Countdown from "@/components/count-down.tsx";
import {Image} from "@unpic/react";
import {finalImagePath, isGameClosed} from "@/lib/utils.ts";

interface TodayGameCardProps {
  game: Game
  className?: string
}

const LatestDrawCard = ({
                          className, game
                        }: TodayGameCardProps) => {

  const bgColors = [
    'bg-accent-1-900',
    'bg-background',
  ]

  const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return (
    <div className={`relative grid grid-cols-1 overflow-hidden gap-4 rounded-[20px] p-6 shadow-lg max-w-md mx-auto ${bgColor} ${className}`}>

      {/* Header section */}
      <div className="flex flex-col gap-4 items-start justify-start">
        <div className="flex items-start space-x-2">
          <div className="flex flex-col gap-2">
            <div className="image-container flex justify-center">
              <Image src={finalImagePath(game.gameBackgroundImageUrl)} alt={game.gameName} width={67} height={67}
                     className="rounded object-fill" />
            </div>
            <h3 className="font-bold text-lg text-bgColor truncate text-center">
              {game.gameName}
            </h3>
            <div className="flex flex-col">
              <div className="text-foreground text-sm text-center truncate">
                Next Draw in: <span><Countdown targetDate={game.endDateTime} /></span>
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="button" size="md" className="w-fit bg-primary-900 px-4 h-9 text-background rounded-full hover:opacity-80" disabled={isGameClosed(game.endDateTime)}>
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