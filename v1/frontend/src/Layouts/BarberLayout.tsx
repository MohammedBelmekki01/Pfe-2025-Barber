
import { Outlet, useNavigate } from "react-router-dom"
import { Footer } from "./Base/Footer"
import { NavbarBarber } from "./Base/NavbarBarber"
import { useEffect, useState } from "react"
import { useUsercontext } from "@/context/UserContext"
import { ROUTE_LOGIN } from "@/router"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { UserApi } from "@/Services/Api/Barber/UserApi"
import { AppSideidebarBarber } from "@/components/app-sidebarBarber"

function BarberLayout() {
  type User = {
    name: string
    email: string
  }

  const navigate = useNavigate()
  const { setUser, authenticated, setAuthenticated, user, logout } = useUsercontext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      setAuthenticated(false)
      navigate(ROUTE_LOGIN)
      return
    }

    UserApi.getUser()
      .then(({ data }) => {
        console.log( typeof authenticated);
        setUser(data)
        setAuthenticated(true)
        setIsLoading(false)

      })
      .catch(() => {
        logout()
        navigate(ROUTE_LOGIN)
        setIsLoading(false)
      })
  }, [])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Your existing Navbar */}
      <NavbarBarber />
      {/* Sidebar Layout */}
      <SidebarProvider defaultOpen={false}>
        <AppSideidebarBarber user={user} />
        <SidebarInset>
          {/* Header with Sidebar Trigger */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h2 className="text-lg font-semibold ">Dashboard </h2>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            <div className="flex-1 p-6">
              <h1>barber</h1>
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export default BarberLayout
