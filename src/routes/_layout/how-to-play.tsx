import { createFileRoute } from '@tanstack/react-router'
import { Alert, AlertContent, AlertDescription, AlertIcon } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react';

const HOW_TO_PLAY_STEPS: string[] = [
  'Create an account and complete quick KYC when required for withdrawals.',
  'Fund your wallet via any supported method.',
  'Pick your game (5/90, 2-Direct, Banker, Perm, and more).',
  'Choose your numbers and set your stake.',
  'Confirm your ticket and follow the draw on the Results page.',
  'Get paid automatically into your wallet when you win.',
  'Tip: You can combine strategies across Banker, Perms, and 2-Direct to match your risk preference.',
];


export const Route = createFileRoute('/_layout/how-to-play')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <section
        className="py-10 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">Learn the Basics in
          Minutes</h3>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container space-y-6">
          <ul className="space-y-4">
            {HOW_TO_PLAY_STEPS.map((step, index) => (
              <li key={index} className="flex items-start gap-4">
                <div
                  className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full bg-accent-1-900 text-primary-900 font-medium">
                  {index + 1}
                </div>
                <p className="text-slate-700">{step}</p>
              </li>
            ))}
          </ul>
          <Alert variant="info" appearance="light">
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertContent>
              <AlertDescription>
                <strong>Tip:</strong>You can combine strategies across Banker, Perms, and 2-Direct
                to match your risk preference.
              </AlertDescription>
            </AlertContent>
          </Alert>


        </div>
      </section>
    </>
  )
}
