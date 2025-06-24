import { Booking } from "@/components/HomeComponents/Booking"
import { Contact } from "@/components/HomeComponents/Contact"
import { Hero } from "@/components/HomeComponents/Hero"
import { Portfolio } from "@/components/HomeComponents/Portfolio"
import { Reviews } from "@/components/HomeComponents/Review"
import { Services } from "@/components/HomeComponents/Services"
import { Team } from "@/components/HomeComponents/Teams"

function Home() {
  return (
    
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100">

      <Hero />
      <Services />
      <Portfolio />
      <Team />
      <Booking />
      <Reviews />
      <Contact />

    </div>
  )
}

export default Home