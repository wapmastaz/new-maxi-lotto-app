import {Alert, AlertContent, AlertDescription, AlertIcon} from '@/components/ui/alert'
import {Link} from "@tanstack/react-router";
import {TriangleAlert} from "lucide-react"

const WithdrawalNotification = () => {
  return (
    <Alert variant="info" appearance="light">
      <AlertIcon>
        <TriangleAlert />
      </AlertIcon>
      <AlertContent>
        <AlertDescription>
          Please complete your bank details <Link className='text-primary font-semibold underline'
                                                  to="/settings/bank">here</Link> and verify your email <Link
          to="/profile" className='text-primary font-semibold underline'>here</Link> to enable withdrawals.
        </AlertDescription>
      </AlertContent>
    </Alert>
  )
}

export default WithdrawalNotification