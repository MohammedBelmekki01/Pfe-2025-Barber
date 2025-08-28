import { useEffect, useState } from 'react';
import ServiceForm from './ServiceForm';
import ServiceList from './ServiceList';
import axiosClient from '@/api/axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Settings, Grid3X3, List } from "lucide-react";

export default function ServiceParent() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const fetchServices = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Loading services...");
    try {
      const res = await axiosClient.get('/api/barber/services');
      setServices(Array.isArray(res.data.data) ? res.data.data : []);
      toast.success("Services loaded successfully!");
    } catch (error) {
      toast.error("Error loading services");
    }
    toast.dismiss(loadingToast);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = async (form) => {
    const data = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        data.append(key, form[key]);
      }
    }
    const loadingToast = toast.loading("Adding service...");
    try {
      await axiosClient.post('/api/barber/services', data);
      toast.success("Service added successfully!");
      fetchServices();
    } catch {
      toast.error("Error adding service");
    }
    toast.dismiss(loadingToast);
  };

  const handleUpdate = async (form) => {
    const data = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        data.append(key, form[key]);
      }
    }
    const loadingToast = toast.loading("Updating service...");
    try {
      await axiosClient.post(`/api/barber/services/${editing.id}?_method=PUT`, data);
      toast.success("Service updated successfully!");
      setEditing(null);
      fetchServices();
    } catch {
      toast.error("Error updating service");
    }
    toast.dismiss(loadingToast);
  };

  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting service...");
    try {
      await axiosClient.delete(`/api/barber/services/${id}`);
      toast.success("Service deleted successfully!");
      fetchServices();
    } catch {
      toast.error("Error deleting service");
    }
    toast.dismiss(loadingToast);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.price.toString().includes(search)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Service Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your barber services and pricing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {services.length} Services
            </Badge>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="rounded-xl"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or price..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Form and List */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              My Services
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editing ? 'Edit Service' : 'Add Service'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <ServiceList
              services={filteredServices}
              onEdit={setEditing}
              onDelete={handleDelete}
              loading={loading}
              viewMode={viewMode}
            />
          </TabsContent>

          <TabsContent value="add">
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-900/20 dark:to-blue-900/20 p-8">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {editing ? <Settings className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  {editing ? 'Edit Service' : 'Add New Service'}
                </CardTitle>
                <CardDescription className="text-lg">
                  {editing ? 'Update your service details' : 'Create a new service for your clients'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <ServiceForm
                  onSubmit={editing ? handleUpdate : handleCreate}
                  initialData={editing}
                  isEditing={!!editing}
                  onCancel={() => setEditing(null)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}