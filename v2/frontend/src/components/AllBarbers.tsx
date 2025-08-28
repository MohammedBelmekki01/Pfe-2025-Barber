"use client"

import { useEffect, useState } from "react"
import axiosClient from "@/api/axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

type Barber = {
    id: number
    firstname: string
    lastname: string
    phone: string
    email: string
    location?: string
    experience?: string
    avatar?: string
}

export default function AdminBarbersList() {
    const [barbers, setBarbers] = useState<Barber[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setLoading(true)
            axiosClient
                .get("/api/client/barbers", {
                    params: { search: searchTerm },
                })
                .then((res) => {
                    setBarbers(res.data.data)
                    setError(null)
                })
                .catch((err) => {
                    setError(err.response?.data?.message || err.message || "Failed to fetch barbers")
                })
                .finally(() => setLoading(false))
        }, 400) // debounce delay

        return () => clearTimeout(delayDebounce)
    }, [searchTerm])

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">All Barbers</h1>

            {/* 🔍 Search Input */}
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Search by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>

            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
                </div>
            )}

            {error && (
                <div className="text-center text-red-600 py-10">
                    <p>Error: {error}</p>
                </div>
            )}

            {!loading && !error && barbers.length === 0 && (
                <div className="text-center text-gray-500 py-10 dark:text-gray-400">No barbers found.</div>
            )}

            {!loading && !error && barbers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {barbers.map((barber) => (
                        <Card key={barber.id} className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="flex items-center space-x-4">
                                <Avatar className="w-16 h-16 ring-2 ring-blue-500">
                                    {barber.avatar ? (
                                        <AvatarImage src={barber.avatar} alt={`${barber.firstname} ${barber.lastname}`} />
                                    ) : (
                                        <AvatarFallback>
                                            {barber.firstname.charAt(0)}
                                            {barber.lastname.charAt(0)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                                        {barber.firstname} {barber.lastname}
                                    </CardTitle>
                                    {barber.location && (
                                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                            {barber.location}
                                        </CardDescription>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="flex flex-col space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                    <div>
                                        <span className="font-semibold">Email:</span>{" "}
                                        <a href={`mailto:${barber.email}`} className="text-blue-600 hover:underline">
                                            {barber.email}
                                        </a>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Phone:</span> +212 {barber.phone}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Location:</span> {barber.location}
                                    </div>
                                    {barber.experience && (
                                        <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {barber.experience}
                                        </Badge>
                                    )}
                                </div>

                                <Button variant="outline" size="sm" className="mt-4 w-full">
                                    <Link
                                        to={`/client/barber-details?id=${barber.id}`}
                                        className="text-emerald-600 hover:underline block w-full text-center"
                                    >
                                        Details
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
