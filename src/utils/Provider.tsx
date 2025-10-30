import { Suspense, useState } from "react"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import PageLoader from "@/components/page-loader"

interface ProviderProps {
  children: React.ReactNode
}

const Provider = ({ children }: ProviderProps) => {

  const [client] = useState(new QueryClient())

  return (
    <>
      <QueryClientProvider client={client}>
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export { Provider }
