import BarberDashboard from "@/components/Barber/BarberDashboard";
import ChaireLayout from "@/Layouts/ChaireLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import Login from "@/Pages/Login";
import NotFoundPage from "@/Pages/NotFoundPage";
import { createBrowserRouter } from "react-router-dom";
import BarberLayout from "@/Layouts/BarberLayout";
import AdminDashboardLayout from "@/Layouts/Adminayout";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import ClientLayout from "@/Layouts/ClientLayout";
import ClientDashboard from "@/components/Client/ClientDashboard";
import ManageClients from "@/components/Admin/ManageClients";
import ManageBarber from "@/components/Admin/ManageBarber";
import Home from "@/Pages/Home";

export const ROUTE_LOGIN = '/login'
export const BARBER_DASHBOARD_ROUTE= '/barber/dashboard'
export const ADMIN_DASHBOARD_ROUTE = '/admin/dashboard'
export const ADMIN_MANAGE_CLIENT_ROUTE = '/admin/manage-client'
export const ADMIN_MANAGE_BARBERS_ROUTE = '/admin/manage-barber'
export const client_DASHBOARD_ROUTE = '/client/dashboard'
export const redirectToDashboard = (roleType : any) => {
            switch (roleType) {

          case 'barber':
            return (BARBER_DASHBOARD_ROUTE)
           
          case 'admin':
            return (ADMIN_DASHBOARD_ROUTE)
           
          case 'client':
            return (client_DASHBOARD_ROUTE)
           
          default:
           
        }
}
export const router = createBrowserRouter([
    {
        element: <ChaireLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    },
    {
        element : <BarberLayout />,
        children : [
            {
                path : BARBER_DASHBOARD_ROUTE,
                element : <BarberDashboard />
            }
        ]
    },
    {
        element : <GuestLayout />,
        children : [
            {
                path: ROUTE_LOGIN,
                element: <Login />
            },
        ]
    },
    {
        element : <AdminDashboardLayout />,
        children : [
            {
                path : ADMIN_DASHBOARD_ROUTE,
                element : <AdminDashboard />
            },
                        {
                path : ADMIN_MANAGE_CLIENT_ROUTE,
                element : <ManageClients />
            },
            {
                path : ADMIN_MANAGE_BARBERS_ROUTE,
                element : <ManageBarber />
            }
        ]
    },
    {
        element : <ClientLayout />,
        children : [
            {
                path : client_DASHBOARD_ROUTE,
                element : <ClientDashboard />
            }
        ]
    }
])