import { Outlet } from "react-router-dom"
import {Navbar} from "./Base/Navbar"
import {Footer} from "./Base/Footer"

function ChaireLayout() {
  return (
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
  )
}

export default ChaireLayout