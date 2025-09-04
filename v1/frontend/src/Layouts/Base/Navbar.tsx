import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link, useLocation } from "react-router-dom"
import { ModeToggle } from "@/components/ui/mode-toggle"

const navigation = [
  { name: "Home", to: "/#hero" },
  { name: "Services", to: "/#services" },
  { name: "Our Team", to: "/#team" },
  { name: "Gallery", to: "/#gallery" },
  { name: "Testimonials", to: "/#testimonials" },
  { name: "Contact", to: "/#contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const location = useLocation()

  // Handle smooth scrolling
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault()

    // If we're not on the homepage, navigate there first
    if (location.pathname !== "/") {
      window.location.href = to
      return
    }

    // Extract the section ID from the href
    const sectionId = to.replace("/#", "")
    const element = document.getElementById(sectionId)

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      setIsOpen(false) // Close mobile menu after clicking
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Barber Shop
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.to}
                  onClick={(e) => handleClick(e, item.to)}
                  className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              
              variant="default"
              className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700"
            >
              <Link to="/login">Login</Link>
            </Button>
            <ModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.to}
                      onClick={(e) => handleClick(e, item.to)}
                      className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="pt-4 mx-2">
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
