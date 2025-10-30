import { useRouterState } from "@tanstack/react-router"

const PageLoader = () => {

  const { isLoading } = useRouterState({
    select: (s) => s.isLoading,
  })

  if (!isLoading) return null

  return (
    <div className="flex items-center justify-center h-[calc(100vh-138px)]">
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