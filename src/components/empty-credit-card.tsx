
import { AlertCircle } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const EmptyCreditCard = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle />
        </EmptyMedia>
        <EmptyTitle>No Debits Cards Found</EmptyTitle>
        <EmptyDescription>
          You don&apos;t have any debits cards yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
