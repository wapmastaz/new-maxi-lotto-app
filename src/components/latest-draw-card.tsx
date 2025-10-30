import type { LatestDrawTicketResponse } from '@/types/api';
import { formattedDate } from '@/lib/utils';
import { Image } from '@unpic/react';
import Ball from './ball';

interface LotteryTicketProps {
  item: LatestDrawTicketResponse
  className?: string
}

type Result = {
  [key: string]: number;
};

const LatestDrawCard = ({
  className, item
}: LotteryTicketProps) => {

  const result: Result = item.result;

  const winningBalls = Object.keys(result)
    .filter((key) => key.startsWith("winningBall"))
    .map((key) => result[key]);

  const bgColors = [
    'bg-accent-1-900',
    'bg-background',
  ]

  const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];


  return (
    <div className={`relative grid grid-cols-2 gap-4 rounded-xl p-6 shadow-lg max-w-md mx-auto ${bgColor} ${className}`}>

      {/* Header section */}
      <div className="flex flex-col gap-4 items-start justify-start">
        <div className="flex items-start space-x-2">
          {/* background: radial-gradient(50% 50% at 50% 50%, #00D49C 38.46%, #006E51 100%); */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold font-poppins" style={
            {
              background: "radial-gradient(50% 50% at 50% 50%, #00D49C 38.46%, #006E51 100%)"
            }
          }>
            {item.gameCode}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-lg text-primary-900 truncate">{item.gameName}</h3>
            <div className="flex flex-col">
              <div className="text-foreground font-bold text-sm truncate">
                Draw Taken on
              </div>
              <div className="text-foreground truncate font-medium text-xs">
                {formattedDate(item.endDateTime)}
              </div>
            </div>
          </div>

        </div>

        {/* Winning Numbers section */}
        <div className="space-y-3">
          <h3 className="text-primary-900 font-semibold text-lg">Winning Numbers</h3>

          <div className="flex space-x-3">

            {winningBalls.map((ball, idx) => (
              <Ball
                key={`winning-${idx}`}
                value={ball}
                isSelected
                className="bg-primary-900 rounded-full"
              />)
            )}

          </div>
        </div>
      </div>

      <div className="flex items-center absolute right-4 top-7">
        <Image src={"/dollar-bag-1.png"} alt="Dollar Bag" width={148} height={93} className="rounded object-contain" />
      </div>

    </div>
  );
};

export default LatestDrawCard;