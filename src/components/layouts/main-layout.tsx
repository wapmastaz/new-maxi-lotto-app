import { Outlet } from '@tanstack/react-router'
import Navbar from './navbar'
import Footer from './footer'

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
