import { formatCurrency } from '@/lib/utils'

const UserBalance = ({ walletBalance }: { walletBalance: number }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-3xl font-bold text-[#0185B6] font-montserrat">
        {formatCurrency(walletBalance)}
      </p>
      <p className="text-base text-muted-foreground">Balance</p>
    </div>
  )
}

export default UserBalance