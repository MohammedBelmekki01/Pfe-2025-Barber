"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Settings, Shield } from "lucide-react"
import axiosClient from "@/api/axios"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(60),
  // 🔧 FIX: Phone validation plus flexible
  phone: z.string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits")
    .regex(/^[0-9+\-\s()]*$/, "Phone number format is invalid"),
  addrees: z.string().min(2, "Address must be at least 2 characters").max(255),
  password: z
    .preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().min(6, "Password must be at least 6 characters").optional()
    ),
})

function UpdateClient({ onUpdate }: { onUpdate?: () => void }) {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      addrees: "",
      password: "",
    },
  })

  const fetchClientData = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/api/me')
      const clientData = response.data

      form.reset({
        name: clientData.name || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
        addrees: clientData.addrees || "",
        password: "",
      })
    } catch (error) {
      console.error('Error fetching client data:', error)
      toast.error("Error loading profile data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientData()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      const loadingToast = toast.loading("Updating profile...")
      
      // Filter out empty password
      const submitData = { ...values }
      if (!submitData.password) {
        delete submitData.password
      }

      // 🔧 FIX: Utiliser l'endpoint correct
      const response = await axiosClient.put('/api/client/profile', submitData)
      
      toast.dismiss(loadingToast)

      if (response.status === 200) {
        toast.success("Profile updated successfully! 🎉", {
          description: "Your profile has been updated successfully.",
          duration: 4000, // 🔧 ADD: Durée du toast
        })
        
        // Clear password field after successful update
        form.setValue("password", "")
        
        // 🔧 ADD: Refresh form with new data
        await fetchClientData()
        
        // Call onUpdate callback if provided
        if (onUpdate) onUpdate()
      }
    } catch (error: any) {
      toast.dismiss()
      
      // 🔧 IMPROVE: Meilleure gestion des erreurs
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Erreurs de validation
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            message: Array.isArray(messages) ? messages.join(", ") : messages,
          })
        })
        toast.error("Please check the form for errors")
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.")
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.")
      } else {
        toast.error(error.response?.data?.message || "An unexpected error occurred")
      }
      
      console.error('Update error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 🔧 ADD: Function to reset form
  const handleReset = () => {
    fetchClientData()
    toast.info("Form reset to original values")
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl">
        <CardContent className="p-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 p-8">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Settings className="w-6 h-6" />
          Edit Profile
        </CardTitle>
        <CardDescription className="text-lg">
          Update your account information and contact details
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="John Doe"
                        className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        {...field}
                        // 🔧 ADD: Disable autocomplete si nécessaire
                        autoComplete="name"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          {...field}
                          autoComplete="email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Phone Number *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          placeholder="0612345678"
                          inputMode="tel"
                          className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          {...field}
                          autoComplete="tel"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="addrees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Address *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="123 Main Street, City, Country"
                        className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        {...field}
                        autoComplete="street-address"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    New Password (optional)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Leave empty to keep current password"
                        className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        {...field}
                        autoComplete="new-password"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              {/* 🔧 ADD: Reset button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Reset Form
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UpdateClient