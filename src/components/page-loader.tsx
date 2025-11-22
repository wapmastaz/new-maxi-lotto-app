import { useRouterState } from "@tanstack/react-router"

const PageLoader = () => {
  const status = useRouterState({ select: s => s.status })
  const isLoading = status !== "idle"

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <svg className="animate-spin h-8 w-8 text-primary-900" viewBox="0 0 24 24">
        <circle cx="4" cy="12" r="2" fill="currentColor" />
        <circle cx="12" cy="4" r="2" fill="currentColor" />
        <circle cx="20" cy="12" r="2" fill="currentColor" />
        <circle cx="12" cy="20" r="2" fill="currentColor" />
      </svg>
    </div>
  )
}

export default PageLoader
