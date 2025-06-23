"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Bell, Crown, Scissors } from "lucide-react"

// Mock user data - replace with your actual user object
const mockUser = {
  name: "John Doe",
  email: "john.doe@barbershop.com",
  role: "Master Barber",
  avatar: "/placeholder.svg?height=40&width=40",
  status: "online",
  appointmentsToday: 8,
  rating: 4.9,
}

// Option 1: Simple Card Layout (Recommended)
export function UserDisplayCard({ user = mockUser, isLoading = false }) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-amber-500">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-amber-100 text-amber-800 font-semibold">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-gray-900">👋 Hello, {user.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-amber-600 font-medium">⭐ {user.rating} Rating</span>
                <span className="text-xs text-blue-600 font-medium">📅 {user.appointmentsToday} Today</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

// Option 2: Header Bar Style
export function UserDisplayHeader({ user = mockUser, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8 border border-blue-500">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="bg-blue-100 text-blue-800 text-sm font-semibold">
            {user.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900 text-sm">👋 {user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          Online
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Option 3: Dropdown Profile Menu (Most Professional)
export function UserDisplayDropdown({ user = mockUser, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg">
          <Avatar className="h-8 w-8 border border-amber-500">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-amber-100 text-amber-800 text-sm font-semibold">
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="font-medium text-sm text-gray-900">👋 {user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <Scissors className="w-3 h-3 mr-1" />
                {user.role}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Option 4: Dashboard Stats Card
export function UserDisplayStats({ user = mockUser, isLoading = false }) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-amber-500">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-amber-100 text-amber-800 font-bold text-lg">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">👋 {user.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{user.email}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/50 rounded px-2 py-1">
                <div className="font-semibold text-amber-700">⭐ {user.rating}</div>
                <div className="text-gray-600">Rating</div>
              </div>
              <div className="bg-white/50 rounded px-2 py-1">
                <div className="font-semibold text-blue-700">{user.appointmentsToday}</div>
                <div className="text-gray-600">Today</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
