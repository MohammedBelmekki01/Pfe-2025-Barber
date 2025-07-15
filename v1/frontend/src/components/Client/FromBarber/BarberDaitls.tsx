"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { toast } from "sonner"
import axiosClient from "@/api/axios"
import BarberDetails from "./BarberDetails"

// 💡 Type Barber (à réutiliser depuis ton fichier si tu veux)
export type Barber = {
  id: number
  firstname: string
  lastname: string
  date_of_birth: string
  gender: "m" | "f"
  address: string
  phone: string
  email: string
  bio: string
  experience: string
  location: string
  email_verified_at: string | null
  formatted_updated_at?: string
  updated_at?: string
  created_at?: string
}

export default function BarberDetailsPageForClient() {
  const location = useLocation()
  const [barber, setBarber] = useState<Barber | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const barberId = queryParams.get("id")

    const fetchBarber = async () => {
      if (!barberId) {
        setLoading(false)
        setError("No barber ID provided in the URL.")
        toast.error("Missing ID", {
          description: "Please use /barber-details?id=1",
        })
        return
      }

      setLoading(true)
      const loadingToast = toast.loading("Fetching barber details...")

      try {
        const response = await axiosClient.get(`/api/client/barbers/${barberId}`) 
        setBarber(response.data)
        toast.dismiss(loadingToast)
        toast.success("Barber loaded successfully!")
      } catch (err: any) {
        toast.dismiss(loadingToast)
        setError(err?.response?.data?.message || "Failed to fetch barber.")
        toast.error("Error", {
          description: err?.response?.data?.message || err.message,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBarber()
  }, [location.search])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading barber details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  if (!barber) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Barber not found.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <BarberDetails barber={barber} />
    </div>
  )
}
