import { ContactSection } from "@/components/HomeComponents/ContactSection"
import { Hero } from "@/components/HomeComponents/Hero"
import {  TestimonialsSection } from "@/components/HomeComponents/TestimonialsSection"
import { GallerySection } from "@/components/HomeComponents/GallerySection"
import { BarberCarousel } from "@/components/HomeComponents/AboutSection"
import { ServicesCarousel } from "@/components/HomeComponents/ServicesSlider"

function Home() {
  return (
    
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100">

            <Hero />
      <ServicesCarousel />
      <BarberCarousel />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />

    </div>
  )
}

export default Home