import { ProfileSettingsForm } from '@/components/settings/profile-settings-form'
import { useUserProfile } from '@/hooks/useUserProfile'
import { createFileRoute } from '@tanstack/react-router'
import DataLoader from "@/components/data-loader.tsx"

export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isFetching } = useUserProfile()

  return (
    <>
      <section className="py-14 sm:py-24 flex justify-center items-center relative bg-gradient-to-b from-[#01B1A8] to-[#0185B6] overflow-hidden">
        <h3 className="font-montserrat text-lg text-white font-bold">Profile Settings</h3>
      </section>

      {/* === profile settings form === */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {isFetching || !user ? (
            <DataLoader />
          ) : (
            <ProfileSettingsForm user={user} />
          )}
        </div>
      </section>
    </>
  )
}