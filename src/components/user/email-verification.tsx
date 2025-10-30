import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertIcon,
  AlertContent,
  AlertDescription,
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface EmailVerificationAlertProps {
  onVerify?: () => void;
  onDismiss?: () => void;
  isVerifying?: boolean;
}

const EmailVerificationAlert = ({ }: EmailVerificationAlertProps) => {

  return (
    <Alert variant="destructive" appearance="light" close={true} onClose={() => console.log("logged out")}>
      <AlertIcon>
        <AlertCircle />
      </AlertIcon>
      <AlertContent>
        <AlertDescription>
          <p>
            Your email is not verified. Please verify your email to access all
            features.
          </p>
          <div className="space-x-3.5 underline mt-2">
            <Button
              variant="link"
              asChild
            >
              <Link to="/profile">Verify Email</Link>
            </Button>

          </div>
        </AlertDescription>
      </AlertContent>
    </Alert>
  );
};

export default EmailVerificationAlert;
