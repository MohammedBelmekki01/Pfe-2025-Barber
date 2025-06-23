import {Navbar} from './Base/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import {Footer} from './Base/Footer'
import { useContext, useEffect } from 'react';
import { useUsercontext } from '@/context/UserContext';
import { BARBER_DASHBOARD_ROUTE } from '@/router';

function GuestLayout() {
  const {authenticated} = useUsercontext()
    const navigate = useNavigate()
useEffect(() => {
  const token = localStorage.getItem("token");

  if (authenticated || token) {
    navigate(BARBER_DASHBOARD_ROUTE);
  }
}, []);

  return (
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
  )
}

export default GuestLayout