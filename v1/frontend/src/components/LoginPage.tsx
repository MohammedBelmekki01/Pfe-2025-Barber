"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, Scissors, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useUsercontext } from "@/context/UserContext"
import { redirectToDashboard } from "@/router"

const formSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "Minimum 8 caractères" }),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login, setAuthenticated, setToken } = useUsercontext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "test@example.com",
      password: "123456789",
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await login(values.email, values.password)
      if (response && response.status === 200 && response.data?.user) {
        setToken(response.data.token)
        setAuthenticated(true)
        navigate(redirectToDashboard(response.data.user.role))
      } else {
        form.setError("email", {
          message: response?.data?.message ?? "Invalid credentials",
        })
      }
    } catch ({ response }: any) {
      form.setError("email", {
        message: response?.data?.message ?? "Erreur lors de la connexion",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background bubbles - hidden on small devices */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Container */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 p-6 sm:p-8 md:p-10 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Sign in to your account</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <Input
                          autoComplete="email"
                          placeholder="Enter your email"
                          className="pl-12 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <Input
                          autoComplete="current-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-12 pr-12 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-white rounded-xl py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 shadow-lg hover:shadow-emerald-500/25"
              >
                {isSubmitting && <Loader2 className="animate-spin w-5 h-5" />}
                {isSubmitting ? "Signing in..." : "Login"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/90 dark:bg-gray-900/90 text-gray-500">or</span>
            </div>
          </div>

          {/* Register Buttons */}
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              Don't have an account? Choose a type:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => (window.location.href = "/register/clients")}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-xl font-semibold transition-all duration-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:scale-105 group"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Client</span>
              </button>
              <button
                onClick={() => (window.location.href = "/register/barbers")}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 group"
              >
                <Scissors className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Barber</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
