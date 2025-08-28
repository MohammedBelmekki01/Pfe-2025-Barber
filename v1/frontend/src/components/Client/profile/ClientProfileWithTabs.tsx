"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings } from "lucide-react"
import ClientProfile from "./ClientProfile"
import UpdateClient from "./UpdateClient"

function ClientProfileWithTabs() {
  const [activeTab, setActiveTab] = useState("profile")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleProfileUpdate = () => {
    // Force refresh of the profile tab by changing the key
    setRefreshKey(prev => prev + 1)
    // Switch to profile tab to show updated data
    setActiveTab("profile")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto h-12">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2 text-sm font-medium transition-all duration-300"
            >
              <User className="w-4 h-4" />
              Profile Info
            </TabsTrigger>
            <TabsTrigger 
              value="edit" 
              className="flex items-center gap-2 text-sm font-medium transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile" className="space-y-0">
            <ClientProfile key={refreshKey} />
          </TabsContent>

          {/* Edit Profile Tab */}
          <TabsContent value="edit" className="space-y-0">
            <UpdateClient onUpdate={handleProfileUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ClientProfileWithTabs