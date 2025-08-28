import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, } from "react";
import { useUsercontext } from "@/context/UserContext";
import { redirectToDashboard, ROUTE_LOGIN } from "@/router";
import { UserApi } from "@/Services/Api/Barber/UserApi";
import { AppSidebar } from "@/components/app-sidebar";
import { Footer } from "./Base/Footer";
import { NavbarAdmin } from "./Base/NavbarAdmin";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { AppSideidebarAdmin } from "@/components/app-sidebarAdmin";

export default function AdminDashboardLayout() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const { authenticated, user, setUser, setAuthenticated, logout: contextLogout } = useUsercontext()
  useEffect(() => {
    if (authenticated === true) {
      setIsLoading(false)
      UserApi.getUser().then(({ data }) => {
        const { role } = data
        if (role !== 'admin') {
          navigate(redirectToDashboard(role))
        }
        setUser(data)
        setAuthenticated(true)
      }).catch((reason) => {
        contextLogout()
      })
    } else {
      navigate(ROUTE_LOGIN)
    }

  }, [authenticated]);

  if (isLoading) {
    return <></>
  }

  return <>
    <NavbarAdmin />
    {/* Sidebar Layout */}
    <SidebarProvider defaultOpen={false}>
      <AppSideidebarAdmin user={user} />
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
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  </>
}