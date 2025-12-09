import { useState } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

interface ProviderProps {
  children: React.ReactNode
}

const Provider = ({ children }: ProviderProps) => {

  const [client] = useState(new QueryClient())

  return (
    <>
      <QueryClientProvider client={client}>
          {children}
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      </QueryClientProvider>
    </>
  )
}

export { Provider }
