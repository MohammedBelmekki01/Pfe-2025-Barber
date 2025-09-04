"use client"

import { useEffect, useState, useMemo } from "react"
import { format, parseISO, isSameDay, startOfToday } from "date-fns"
import { fr } from 'date-fns/locale'
import { CalendarDays, Clock, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import axiosClient from "@/api/axios"
import { BarberSchedule } from "@/types/barber"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BarberScheduleDisplayProps {
  barberId: number
}

// Update the interface to match the API response
interface BarberScheduleResponse {
  data: {
    [key: string]: {
      id: number
      start_time: string
      end_time: string
      service_name: string
      duration: number
      status: string
    }
  }
  barber_id: string
}

export default function BarberScheduleDisplay({ barberId }: BarberScheduleDisplayProps) {
  const [schedule, setSchedule] = useState<BarberSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get<BarberScheduleResponse>(`/api/client/barbers/${barberId}/schedule`)
        // Convert object to array
        const scheduleArray = Object.values(response.data.data)
        setSchedule(scheduleArray)
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load schedule")
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [barberId])

  // Convert object to array and filter by date
  const filteredSchedule = useMemo(() => {
    const scheduleArray = Object.values(schedule)
    
    if (!selectedDate) return scheduleArray

    return scheduleArray.filter(appointment => {
      const appointmentDate = parseISO(appointment.start_time)
      return isSameDay(appointmentDate, selectedDate)
    })
  }, [schedule, selectedDate])

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredSchedule.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage)

  // Reset page when date changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedDate])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="p-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-5 w-5 text-emerald-500" />
            Planning des Rendez-vous
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
              onClick={() => setSelectedDate(startOfToday())}
            >
              Aujourd'hui
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'dd MMMM yyyy', { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {selectedDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(undefined)}
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {currentItems.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              {selectedDate 
                ? `Aucun rendez-vous pour le ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`
                : "Aucun rendez-vous programmé"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {currentItems.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 transition-all duration-200 hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                  {/* Time */}
                  <div className="flex-none w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {format(new Date(appointment.start_time), "HH:mm")}
                    </span>
                    <span className="text-xs text-emerald-500 dark:text-emerald-500">
                      {format(new Date(appointment.start_time), "MMM dd")}
                    </span>
                  </div>

                  {/* Service Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {appointment.service_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Duration: {appointment.duration} min
                    </p>
                  </div>

                  {/* Status Badge */}
                  <Badge
                    variant="outline"
                    className={`
                      ${
                        appointment.status === "confirmed"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/20 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }
                    `}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500">
                Affichage {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredSchedule.length)} sur{" "}
                {filteredSchedule.length} rendez-vous
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}