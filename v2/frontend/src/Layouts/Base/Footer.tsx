"use client"

import * as React from "react"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

const footerLinks = {
  company: [
    { name: "About Us", to: "/about" },
    { name: "Our Team", to: "/team" },
    { name: "Careers", to: "/careers" },
    { name: "Contact", to: "/contact" },
  ],
  services: [
    { name: "Web Design", to: "/services/web-design" },
    { name: "Development", to: "/services/development" },
    { name: "SEO", to: "/services/seo" },
    { name: "Marketing", to: "/services/marketing" },
  ],
  support: [
    { name: "Help Center", to: "/help" },
    { name: "Documentation", to: "/docs" },
    { name: "API Reference", to: "/api" },
    { name: "Status", to: "/status" },
  ],
  legal: [
    { name: "Privacy Policy", to: "/privacy" },
    { name: "Terms of Service", to: "/terms" },
    { name: "Cookie Policy", to: "/cookies" },
    { name: "GDPR", to: "/gdpr" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, to: "#" },
  { name: "Twitter", icon: Twitter, to: "#" },
  { name: "Instagram", icon: Instagram, to: "#" },
  { name: "LinkedIn", icon: Linkedin, to: "#" },
]

export function Footer() {
  const [email, setEmail] = React.useState("")
  const [showScrollTop, setShowScrollTop] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <>
      <footer className=" from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-foreground relative overflow-hidden border-t border-gray-200 dark:border-gray-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5 dark:opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-20 h-20 bg-pink-500 dark:bg-pink-400 rounded-full animate-ping"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Brand
                </h3>
                
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Creating amazing digital experiences that inspire and engage users worldwide.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group">
                  <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>123 Business St, City, State 12345</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group">
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>hello@brand.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h4 className="text-lg font-semibold text-foreground">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <h4 className="text-lg font-semibold text-foreground">Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <h4 className="text-lg font-semibold text-foreground">Stay Updated</h4>
              <p className="text-muted-foreground text-sm">
                Subscribe to our newsletter for the latest updates and offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border focus:border-primary transition-colors"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-border pt-8 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.name}
                      to={social.to}
                      className="text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-125 hover:rotate-12"
                      aria-label={social.name}
                    >
                      <Icon className="w-6 h-6" />
                    </Link>
                  )
                })}
              </div>

              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                <div className="flex space-x-4">
                  {footerLinks.legal.map((link) => (
                    <Link key={link.name} to={link.to} className="hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center text-muted-foreground text-sm">
              <p>&copy; {new Date().getFullYear()} Brand. All rights reserved. Made with ❤️</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg transition-all duration-300 transform hover:scale-110 animate-bounce-in"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </>
  )
}
