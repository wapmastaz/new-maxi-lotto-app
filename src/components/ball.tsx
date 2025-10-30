import { cn } from "@/lib/utils"

interface BallProps {
  value: number
  isSelected?: boolean
  onClick?: (value: number) => void
  className?: string
}

const Ball = ({ value, isSelected = false, onClick, className }: BallProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(value)}
      className={cn(
        "flex justify-center items-center h-11 w-11 rounded bg-white font-poppins font-bold transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-400",
        isSelected
          ? "bg-amber-400 border-amber-400 text-white"
          : "text-[#0A4B7F] hover:bg-[#0A4B7F] hover:text-white",
        className
      )}
    >
      {value}
    </button>
  )
}

export default Ball
