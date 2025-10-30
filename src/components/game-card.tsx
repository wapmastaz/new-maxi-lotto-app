import { cn, finalImagePath, getRandomGradient } from "@/lib/utils";
import { Image } from "@unpic/react";

interface GameCardProps {
  name: string;
  image?: string;
  description?: string;
  className?: string;
}

const GameCard = ({ name, className, image }: GameCardProps) => {
  const gradient = getRandomGradient();

  return (
    <div
      className={cn(`rounded-3xl p-4 gap-4 flex items-center shadow min-w-20 h-20 ${gradient}`, className)}>
      <div className="image-container">
        <Image src={finalImagePath(image || '')} alt={name} width={38} height={38}
          className="rounded object-fill" />
      </div>
      <div className="game-details flex flex-col">
        <h3 className="font-bold text-background">{name}</h3>
        {/* <p className="text-background  text-sm font-poppins">Description</p> */}
      </div>
    </div>
  )
}
export default GameCard