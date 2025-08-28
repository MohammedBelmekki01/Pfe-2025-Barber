import { Outlet, useNavigate} from "react-router-dom";
import {useEffect, useState,} from "react";
import { useUsercontext } from "@/context/UserContext.js";
import {  UserApi } from "@/Services/Api/Barber/UserApi.js";
import {  SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.js";
import { ROUTE_LOGIN } from "@/router";
import { NavbarClient } from "./Base/NavbarClient";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Footer } from "./Base/Footer";
import { AppSideidebarClient } from "@/components/app-sidebarClient";

export default function ClientLayout() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const {authenticated, setUser,user, setAuthenticated, logout: contextLogout} = useUsercontext()
    useEffect(() => {
        if (authenticated === true) {
            setIsLoading(false)
            UserApi.getUser().then(({data}) => {
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
                     <NavbarClient />
              {/* Sidebar Layout */}
              <SidebarProvider defaultOpen={false}>
                <AppSideidebarClient user={user} />
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