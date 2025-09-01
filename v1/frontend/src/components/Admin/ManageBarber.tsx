"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, UserPlus } from "lucide-react";
import CreateBarber from "./FormBarber/CreateBarber";
import AdminBarberList from "../data-table/bareber/AdminBarberList";
import React from "react";

export default function ManageBarber() {
  const [reloadBarbers, setReloadBarbers] = React.useState(0);

  const handleBarberCreated = () => setReloadBarbers((r) => r + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/30 dark:from-slate-900 dark:via-emerald-900/10 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Barber Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your barbers and add new professionals to the team
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-xl">
          <CardContent className="p-0">
            <Tabs defaultValue="barber_list" className="w-full">
              {/* Tabs Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto sm:mx-0 sm:w-auto sm:grid-cols-none sm:flex bg-transparent p-0 h-auto">
                  <TabsTrigger
                    value="barber_list"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 bg-transparent shadow-none"
                  >
                    <Scissors className="w-4 h-4" />
                    <span className="hidden sm:inline">Barber List</span>
                    <span className="sm:hidden">Barbers</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="add_barber"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 bg-transparent shadow-none"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Barber</span>
                    <span className="sm:hidden">Add</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Barber List Tab */}
              <TabsContent value="barber_list" className="p-4 sm:p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        All Barbers
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        View and manage all registered barbers
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  {/* Barber List Component */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <AdminBarberList reload={reloadBarbers} />
                  </div>
                </div>

                {/* Additional Info Section - Hidden on mobile to save space */}
                <div className="hidden lg:block space-y-4">
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-emerald-200 dark:border-emerald-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          Team Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Monitor your barber team performance and client
                          satisfaction ratings.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          Scheduling
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Manage barber schedules and availability for optimal
                          service delivery.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Add Barber Tab */}
              <TabsContent value="add_barber" className="p-0">
                <div className="p-4 sm:p-6">
                  <div className="space-y-4 mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Add New Barber
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Register a new barber professional to your team
                      </p>
                    </div>
                    <Separator className="bg-gray-200 dark:bg-gray-700" />
                  </div>

                  {/* Create Barber Form */}
                  <div className="max-w-2xl mx-auto">
                    <CreateBarber onBarberCreated={handleBarberCreated} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
