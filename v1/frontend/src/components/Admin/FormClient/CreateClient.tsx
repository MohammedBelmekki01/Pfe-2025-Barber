"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  MapPin,
  Phone,
  Lock,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientApi from "@/Services/Api/ClientApi";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(60),
  addrees: z.string().min(2, "addrees must be at least 2 characters").max(255),
  phone: z.string().length(10, "Phone must be 10 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255),
});

interface CreateClientProps {
  onClientCreated?: () => void;
}

function CreateClient({ onClientCreated }: CreateClientProps) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      addrees: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const loadingToast = toast.loading("Creating client...");
      const { status, data } = await ClientApi.create(values);
      toast.dismiss(loadingToast);
      if (status === 201) {
        toast.success("Client created successfully", {
          description: data.message || "The client has been added.",
        });
        form.reset();
        if (onClientCreated) onClientCreated();
      }
    } catch (error: any) {
      toast.dismiss();
      console.error("Error:", error);
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            form.setError(field as any, {
              message: Array.isArray(messages) ? messages.join(", ") : messages,
            });
          }
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Create New Client
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                Add a new client to your system with professional details
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name Field */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <User className="w-4 h-4 text-blue-500" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter full name"
                              className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                              {...field}
                            />
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <Mail className="w-4 h-4 text-green-500" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="Enter email address"
                              className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                              {...field}
                            />
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="addrees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter full address"
                              className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                              {...field}
                            />
                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <Phone className="w-4 h-4 text-purple-500" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter phone number"
                              inputMode="numeric"
                              className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                              {...field}
                            />
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <Lock className="w-4 h-4 text-red-500" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a secure password"
                              className="pl-11 pr-12 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-red-500 dark:focus:border-red-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                              {...field}
                            />
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <button
                              type="button"
                              tabIndex={-1}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              onClick={() => setShowPassword((v) => !v)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Client Account
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateClient;