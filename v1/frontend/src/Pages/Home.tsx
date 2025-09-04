import { Hero } from "@/components/HomeComponents/Hero"
import {  TestimonialsSection } from "@/components/HomeComponents/TestimonialsSection"
import { GallerySection } from "@/components/HomeComponents/GallerySection"
import { BarberCarousel } from "@/components/HomeComponents/AboutSection"
import { ServicesCarousel } from "@/components/HomeComponents/ServicesSlider"
import ContactSection from "@/components/HomeComponents/ContactSection"

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100">
      <div id="hero">
        <Hero />
      </div>
      
      <div id="services">
        <ServicesCarousel />
      </div>
      
      <div id="team">
        <BarberCarousel />
      </div>
      
      <div id="gallery">
        <GallerySection />
      </div>
      
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      
      <div id="contact">
        <ContactSection />
      </div>
    </div>
  )
}

export default Home