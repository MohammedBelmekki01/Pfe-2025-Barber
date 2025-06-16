import BarberDashboard from "@/components/Barber/BarberDashboard";
import BarberLayout from "@/Layouts/BarberLayout";
import ChaireLayout from "@/Layouts/ChaireLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import Login from "@/Pages/Login";
import NotFoundPage from "@/Pages/NotFoundPage";
import { Home } from "lucide-react";
import { createBrowserRouter } from "react-router-dom";

export const ROUTE_LOGIN = '/login'
export const BARBER_DASHBOARD_ROUTE= '/barber/dashboard'
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
    }
])