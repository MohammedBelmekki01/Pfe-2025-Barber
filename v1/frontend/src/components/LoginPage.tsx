import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Scissors, Loader2 } from 'lucide-react';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUsercontext } from '@/context/UserContext';
import { redirectToDashboard } from '@/router';

const formSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "Minimum 8 caractères" })
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, setAuthenticated, setToken } = useUsercontext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "test@example.com",
      password: "123456789"
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await login(values.email, values.password);

      if (response && response.status === 200 && response.data?.user) {
        setToken(response.data.token);
        setAuthenticated(true);
        navigate(redirectToDashboard(response.data.user.role));
      } else {
        form.setError("email", {
          message: response?.data?.message ?? "Invalid credentials",
        });
      }
    } catch ({ response }: any) {
      form.setError("email", {
        message: response?.data?.message ?? "Erreur lors de la connexion",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background bubbles - hidden on small devices */}
      <div className="hidden md:block absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Container */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 p-6 sm:p-8 md:p-10 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <Input
                          autoComplete="email"
                          placeholder="Enter your email"
                          className="pl-12"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <Input
                          autoComplete="current-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-12 pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
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
              Don’t have an account? Choose a type:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => window.location.href = '/register/client'}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-semibold transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:scale-105 group"
              >
                <User className="w-5 h-5" />
                <span>Client</span>
              </button>
              <button
                onClick={() => window.location.href = '/register/barber'}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-semibold transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:scale-105 group"
              >
                <Scissors className="w-5 h-5" />
                <span>Barber</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
