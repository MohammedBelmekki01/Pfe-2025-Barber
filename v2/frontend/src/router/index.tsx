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
import BarberDetailsPage from "@/components/Admin/BarberDaitls";
import AllServicesPage from "@/components/Admin/ForSevices/AllServices";
import BarberDetailsPageForClient from "@/components/Client/FromBarber/BarberDaitls";
import AllBarbers from "@/components/AllBarbers";
import ClientDetailsPage from "@/components/Admin/ClientDetailsPage";
import UserReservationsList from "@/components/Client/ForReservationClient/UserReservationsList";
import AllReservationClient from "@/components/Barber/AllReservation";
import AllClientDoReservation from "@/components/Barber/AllClientDoReservation";
import AllReservationBarber from "@/components/Admin/AllReservationBarber";
import RegisterClient from "@/Pages/RegisterClient";
import RegisterBarber from "@/Pages/RegisterBarber";

export const ROUTE_LOGIN = '/login'
export const BARBER_DASHBOARD_ROUTE = '/barber/dashboard'
export const ADMIN_DASHBOARD_ROUTE = '/admin/dashboard'
export const ADMIN_MANAGE_CLIENT_ROUTE = '/admin/manage-client'
export const ADMIN_MANAGE_BARBERS_ROUTE = '/admin/manage-barber'
export const client_DASHBOARD_ROUTE = '/client/dashboard'
export const Reviews_DASHBOARD_ROUTE = '/admin/reviews'
export const BARBER_DETAILS = '/admin/barber-details'
export const CLIENT_DETAILS = '/admin/client-details'
export const ALL_SERVICES_BARBERFOR_Admin = '/admin/services'
export const ALL_SERVICES_BARBERFOR_CLIENT = '/client/services'
export const BARBER_DETAILSFORCLIENT = '/client/barber-details'
export const BARBER_ALL = '/client/barbers'
export const ALL_RESERVATION = '/barber/reservations'
export const ALL_CLIENT_RESERVATION = '/barber/clients'
export const ALL_RESERVATION_BARBERS_ADMIN = '/admin/reservations'
export const Reservation_ALL_FOR_USER = '/client/reservations'
export const REGISTER_CLIENT = '/register/clients'
export const REGISTER_BARBER = '/register/barbers'

export const redirectToDashboard = (roleType: any) => {
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
        element: <BarberLayout />,
        children: [
            {
                path: BARBER_DASHBOARD_ROUTE,
                element: <BarberDashboard />
            },
            {
                path: ALL_RESERVATION,
                element: <AllReservationClient />
            },
            {
                path: ALL_CLIENT_RESERVATION,
                element: <AllClientDoReservation />
            }
        ]
    },
    {
        element: <GuestLayout />,
        children: [
            {
                path: ROUTE_LOGIN,
                element: <Login />
            },
            {
                path: REGISTER_CLIENT,
                element: <RegisterClient />
            },
                        {
                path: REGISTER_BARBER,
                element: <RegisterBarber />
            },
        ]
    },
    {
        element: <AdminDashboardLayout />,
        children: [
            {
                path: ADMIN_DASHBOARD_ROUTE,
                element: <AdminDashboard />
            },
            {
                path: ADMIN_MANAGE_CLIENT_ROUTE,
                element: <ManageClients />
            },
            {
                path: ADMIN_MANAGE_BARBERS_ROUTE,
                element: <ManageBarber />
            },
            {
                path: BARBER_DETAILS,
                element: <BarberDetailsPage />

            },
            {
                path: ALL_SERVICES_BARBERFOR_Admin,
                element: <AllServicesPage />
            },
            {
                path: CLIENT_DETAILS,
                element: <ClientDetailsPage />

            },
            {
                path: ALL_RESERVATION_BARBERS_ADMIN,
                element: <AllReservationBarber />

            },
        ]
    },
    {
        element: <ClientLayout />,
        children: [
            {
                path: client_DASHBOARD_ROUTE,
                element: <ClientDashboard />
            },
            {
                path: ALL_SERVICES_BARBERFOR_CLIENT,
                element: <AllServicesPage />
            }
            ,
            {
                path: BARBER_DETAILSFORCLIENT,
                element: <BarberDetailsPageForClient />

            },
            {
                path: BARBER_ALL,
                element: <AllBarbers />

            },

            {
                path: Reservation_ALL_FOR_USER,
                element: <UserReservationsList />

            },
        ]
    }
])