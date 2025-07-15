"use client"

import { useUsercontext } from "@/context/UserContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Separator } from "../ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus } from "lucide-react"
import AdminClientList from "../data-table/client/AdminClientList"
import CreateClient from "./FormClient/CreateClient"

export default function ManageClients() {
  const { user } = useUsercontext()

  return (
    <div className="min-h-screen bg-gradient-to-br  dark:from-slate-900 dark:via-emerald-900/10 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Client Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your clients and add new ones to the system
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-xl">
          <CardContent className="p-0">
            <Tabs defaultValue="client_list" className="w-full">
              {/* Tabs Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto sm:mx-0 sm:w-auto sm:grid-cols-none sm:flex bg-transparent p-0 h-auto">
                  <TabsTrigger
                    value="client_list"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 bg-transparent shadow-none"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Client List</span>
                    <span className="sm:hidden">Clients</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="add_client"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 bg-transparent shadow-none"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Client</span>
                    <span className="sm:hidden">Add</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Client List Tab */}
              <TabsContent value="client_list" className="p-4 sm:p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Clients</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">View and manage all registered clients</p>
                    </div>
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  {/* Client List Component */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <AdminClientList />
                  </div>
                </div>

                {/* Additional Info Section - Hidden on mobile to save space */}
                <div className="hidden lg:block space-y-4">
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-emerald-200 dark:border-emerald-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Monitor your client base growth and engagement metrics.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Track recent client registrations and updates.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Add Client Tab */}
              <TabsContent value="add_client" className="p-0">
                <div className="p-4 sm:p-6">
                  <div className="space-y-4 mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Client</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Register a new client in the system</p>
                    </div>
                    <Separator className="bg-gray-200 dark:bg-gray-700" />
                  </div>

                  {/* Create Client Form */}
                  <div className="max-w-2xl mx-auto">
                    <CreateClient />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
