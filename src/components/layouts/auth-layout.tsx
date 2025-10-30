import { Outlet } from '@tanstack/react-router'

const AuthLayout = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-0 p-0 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full sm:max-w-md">
            <Outlet /> {/* Child routes render here */}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">

      </div>
    </div>
  )
}

export default AuthLayout
