// "use client"

// import { useEffect, useState } from "react"
// import axiosClient from "@/api/axios"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
// import { Loader2, Star, MapPin, Phone, Mail } from "lucide-react"
// import { Link } from "react-router-dom"

// type Barber = {
//     id: number
//     firstname: string
//     lastname: string
//     phone: string
//     email: string
//     location?: string
//     experience?: string
//     avatar?: string
// }

// export default function AdminBarbersList() {
//     const [barbers, setBarbers] = useState<Barber[]>([])
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)
//     const [searchTerm, setSearchTerm] = useState("")

//     useEffect(() => {
//         const delayDebounce = setTimeout(() => {
//             setLoading(true)
//             axiosClient
//                 .get("/api/client/barbers", {
//                     params: { search: searchTerm },
//                 })
//                 .then((res) => {
//                     setBarbers(res.data.data)
//                     setError(null)
//                 })
//                 .catch((err) => {
//                     setError(err.response?.data?.message || err.message || "Failed to fetch barbers")
//                 })
//                 .finally(() => setLoading(false))
//         }, 400) // debounce delay

//         return () => clearTimeout(delayDebounce)
//     }, [searchTerm])

//     return (
//         <div className="max-w-7xl mx-auto p-6 space-y-8">
//             {/* Header */}
//             <div className="text-center space-y-2">
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
//                     Our Professional Barbers
//                 </h1>
//                 <p className="text-gray-600 dark:text-gray-400 text-lg">
//                     Meet our talented team of experienced barbers
//                 </p>
//             </div>

//             {/* Search Input */}
//             <div className="max-w-md mx-auto">
//                 <Input
//                     type="text"
//                     placeholder="Search by name, email, or location..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full border-0 bg-gray-100 dark:bg-gray-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
//                 />
//             </div>

//             {loading && (
//                 <div className="flex justify-center items-center py-20">
//                     <Loader2 className="animate-spin w-8 h-8 text-emerald-600" />
//                 </div>
//             )}

//             {error && (
//                 <div className="text-center text-red-600 py-10">
//                     <p>Error: {error}</p>
//                 </div>
//             )}

//             {!loading && !error && barbers.length === 0 && (
//                 <div className="text-center text-gray-500 py-10 dark:text-gray-400">
//                     <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Star className="w-12 h-12 text-gray-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold mb-2">No barbers found</h3>
//                     <p>Try adjusting your search criteria</p>
//                 </div>
//             )}

//             {!loading && !error && barbers.length > 0 && (
//                 <div className="relative">
//                     <Carousel
//                         opts={{
//                             align: "start",
//                             loop: true,
//                         }}
//                         className="w-full"
//                     >
//                         <CarouselContent className="-ml-2 md:-ml-4">
//                             {barbers.map((barber) => (
//                                 <CarouselItem key={barber.id} className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
//                                     <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full">
//                                         <CardHeader className="p-6 text-center">
//                                             <div className="relative mx-auto mb-4">
//                                                 <Avatar className="w-20 h-20 ring-4 ring-emerald-200 dark:ring-emerald-800 shadow-lg group-hover:ring-emerald-300 transition-all duration-300">
//                                                     {barber.avatar ? (
//                                                         <AvatarImage 
//                                                             src={barber.avatar} 
//                                                             alt={`${barber.firstname} ${barber.lastname}`}
//                                                             className="object-cover"
//                                                         />
//                                                     ) : (
//                                                         <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold text-lg">
//                                                             {barber.firstname.charAt(0)}
//                                                             {barber.lastname.charAt(0)}
//                                                         </AvatarFallback>
//                                                     )}
//                                                 </Avatar>
//                                                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
//                                             </div>
//                                             <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors duration-300">
//                                                 {barber.firstname} {barber.lastname}
//                                             </CardTitle>
//                                             {barber.location && (
//                                                 <CardDescription className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
//                                                     <MapPin className="w-4 h-4" />
//                                                     {barber.location}
//                                                 </CardDescription>
//                                             )}
//                                         </CardHeader>

//                                         <CardContent className="p-6 pt-0 space-y-4">
//                                             {/* Contact Info */}
//                                             <div className="space-y-3">
//                                                 <div className="flex items-center gap-3 text-sm">
//                                                     <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
//                                                         <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
//                                                     </div>
//                                                     <a 
//                                                         href={`mailto:${barber.email}`} 
//                                                         className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 truncate flex-1"
//                                                     >
//                                                         {barber.email}
//                                                     </a>
//                                                 </div>

//                                                 <div className="flex items-center gap-3 text-sm">
//                                                     <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
//                                                         <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                                                     </div>
//                                                     <span className="text-gray-700 dark:text-gray-300">
//                                                         +212 {barber.phone}
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             {/* Experience Badge */}
//                                             {barber.experience && (
//                                                 <Badge className="w-full justify-center bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 dark:from-emerald-900/30 dark:to-blue-900/30 dark:text-emerald-300 border-0 rounded-full py-2">
//                                                     <Star className="w-3 h-3 mr-1" />
//                                                     {barber.experience}
//                                                 </Badge>
//                                             )}

//                                             {/* Action Button */}
//                                             <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
//                                                 <Link
//                                                     to={`/client/barber-details?id=${barber.id}`}
//                                                     className="block w-full text-center"
//                                                 >
//                                                     View Details
//                                                 </Link>
//                                             </Button>
//                                         </CardContent>
//                                     </Card>
//                                 </CarouselItem>
//                             ))}
//                         </CarouselContent>

//                         {/* Navigation Arrows */}
//                         <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300" />
//                         <CarouselNext className="hidden md:flex -right-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300" />
//                     </Carousel>

//                     {/* Pagination Dots */}
//                     <div className="flex justify-center mt-8 space-x-2">
//                         {Array.from({ length: Math.ceil(barbers.length / 4) }, (_, i) => (
//                             <button
//                                 key={i}
//                                 className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-all duration-300"
//                                 aria-label={`Go to slide ${i + 1}`}
//                             />
//                         ))}
//                     </div>

//                     {/* Stats */}
//                     <div className="mt-8 text-center">
//                         <p className="text-gray-600 dark:text-gray-400">
//                             Showing <span className="font-semibold text-emerald-600">{barbers.length}</span> professional barbers
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }



"use client"

import { useEffect, useState, useMemo } from "react"
import axiosClient from "@/api/axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Star, MapPin, Phone, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

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
    const [currentPage, setCurrentPage] = useState(1)
    const barbersPerPage = 8

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

    // Pagination logic
    const indexOfLastBarber = currentPage * barbersPerPage
    const indexOfFirstBarber = indexOfLastBarber - barbersPerPage
    const currentBarbers = barbers.slice(indexOfFirstBarber, indexOfLastBarber)
    const totalPages = Math.ceil(barbers.length / barbersPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Our Professional Barbers
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Meet our talented team of experienced barbers
                </p>
            </div>

            {/* Search Input */}
            <div className="max-w-md mx-auto">
                <Input
                    type="text"
                    placeholder="Search by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="w-full border-0 bg-gray-100 dark:bg-gray-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                />
            </div>

            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin w-8 h-8 text-emerald-600" />
                </div>
            )}

            {error && (
                <div className="text-center text-red-600 py-10">
                    <p>Error: {error}</p>
                </div>
            )}

            {!loading && !error && barbers.length === 0 && (
                <div className="text-center text-gray-500 py-10 dark:text-gray-400">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No barbers found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            )}

            {!loading && !error && barbers.length > 0 && (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {currentBarbers.map((barber) => (
                            <Card key={barber.id} className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full">
                                <CardHeader className="p-6 text-center">
                                    <div className="relative mx-auto mb-4">
                                        <Avatar className="w-20 h-20 ring-4 ring-emerald-200 dark:ring-emerald-800 shadow-lg group-hover:ring-emerald-300 transition-all duration-300">
                                            {barber.image ? (
                                                <AvatarImage
                                                    src={
                                                        barber?.image
                                                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/${barber?.image}`
                                                            : "/badgebarber.jpg"
                                                    }
                                                    alt={barber?.firstname}

                                                />
                                            ) : (
                                                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold text-lg">
                                                    {barber.firstname.charAt(0)}
                                                    {barber.lastname.charAt(0)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors duration-300">
                                        {barber.firstname} {barber.lastname}
                                    </CardTitle>
                                    {barber.location && (
                                        <CardDescription className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                            {barber.location}
                                        </CardDescription>
                                    )}
                                </CardHeader>

                                <CardContent className="p-6 pt-0 space-y-4">
                                    {/* Contact Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                                                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <a
                                                href={`mailto:${barber.email}`}
                                                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 truncate flex-1"
                                            >
                                                {barber.email}
                                            </a>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">
                                                +212 {barber.phone}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Experience Badge */}
                                    {barber.experience && (
                                        <Badge className="w-full justify-center bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 dark:from-emerald-900/30 dark:to-blue-900/30 dark:text-emerald-300 border-0 rounded-full py-2">
                                            <Star className="w-3 h-3 mr-1" />
                                            {barber.experience}
                                        </Badge>
                                    )}

                                    {/* Action Button */}
                                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                        <Link
                                            to={`/client/barber-details?id=${barber.id}`}
                                            className="block w-full text-center"
                                        >
                                            View Details
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination className="mt-8">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={() => paginate(currentPage - 1)}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PaginationItem key={i + 1}>
                                        <PaginationLink href="#" isActive={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={() => paginate(currentPage + 1)}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                    {/* Stats */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Showing <span className="font-semibold text-emerald-600">{barbers.length}</span> professional barbers
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}