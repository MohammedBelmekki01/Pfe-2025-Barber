"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
  CalendarIcon,
  Briefcase,
  FileText,
  Save,
  ShieldCheck,
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarberApiii from "@/Services/Api/BarbersApiA/BarberApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const formSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100),
  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100),
  date_of_birth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  gender: z.enum(["m", "f"], { required_error: "Please select a gender" }),
  addrees: z.string().min(2, "addrees must be at least 2 characters").max(255),
  phone: z.string().length(10, "Phone must be 10 digits"),
  email: z.string().email("Please enter a valid email").max(60),
  password: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().min(6, "Password must be at least 6 characters").optional()
  ),
  bio: z.string().min(5, "Bio must be at least 5 characters").max(255),
  experience: z.string().min(1, "Experience is required").max(100),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(255),
  // Updated status enum to match the requested values
  status: z.enum(["pending", "confirmed", "cancelled", "done"], {
    required_error: "Please select a status",
  }),
});

interface UpdateBarberProps {
  barber: any;
  onBarberUpdated?: () => void;
}

function UpdateBarber({ barber, onBarberUpdated }: UpdateBarberProps) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...barber,
      password: "",
      // Ensure status has a default value if barber.status is undefined
      status: barber?.status || "pending", // Default to 'pending' if not set
    },
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    barber?.date_of_birth ? new Date(barber.date_of_birth) : undefined
  );

  useEffect(() => {
    if (date) {
      form.setValue("date_of_birth", format(date, "yyyy-MM-dd"));
    }
  }, [date, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const loadingToast = toast.loading("Updating barber...");
      const { status, data } = await BarberApiii.update(barber.id, values);
      toast.dismiss(loadingToast);

      if (status === 200 || status === 201) {
        toast.success("Barber updated successfully", {
          description: data.message || "Barber has been updated.",
        });
        if (onBarberUpdated) onBarberUpdated();
      }
    } catch (error: any) {
      toast.dismiss();
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
    <div className="w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 p-2">
      <div className="w-full max-w-none">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Update Barber Profile
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
                Modify professional barber information and status
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name Fields */}
                <div className="">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4 text-emerald-500" />
                            First Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter first name"
                                className="pl-10 h-10 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                                {...field}
                              />
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4 text-emerald-500" />
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter last name"
                                className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
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
                </div>

                {/* Date and Gender */}
                <div className="py-2">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <CalendarIcon className="w-4 h-4 text-teal-500" />
                            Date of Birth
                          </FormLabel>
                          <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full h-10 justify-start text-left font-normal bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-lg backdrop-blur-sm transition-all duration-200"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                  {date
                                    ? format(date, "PPP")
                                    : "Select birth date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                  setDate(selectedDate);
                                  field.onChange(selectedDate);
                                  setIsCalendarOpen(false);
                                }}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4 text-cyan-500" />
                            Gender
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 border-2 border-gray-200 dark:border-gray-700 focus:border-cyan-500 dark:focus:border-cyan-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="m">Male</SelectItem>
                              <SelectItem value="f">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-2 py-2">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Mail className="w-4 h-4 text-teal-500" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="Enter email address"
                                className="pl-10 h-10 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-teal-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                                {...field}
                              />
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Phone className="w-4 h-4 text-cyan-500" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter phone number"
                                inputMode="numeric"
                                className="pl-10 h-10 border-2 border-gray-200 dark:border-gray-700 focus:border-cyan-500 dark:focus:border-cyan-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                                {...field}
                              />
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Address and Location */}
                <div className="pt-2 py-2">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="addrees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            Home Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter home address"
                                className="pl-10 h-10 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                                {...field}
                              />
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            Work Location
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter work location"
                                className="pl-10 h-10 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                                {...field}
                              />
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="pt-2 py-2">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Briefcase className="w-4 h-4 text-teal-500" />
                            Experience
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="e.g., 5 years"
                                className="pl-10 h-10 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-teal-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                                {...field}
                              />
                              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <ShieldCheck className="w-4 h-4 text-cyan-500" />
                            Status
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 border-2 border-gray-200 dark:border-gray-700 focus:border-cyan-500 dark:focus:border-cyan-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">
                                Confirmed
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                              <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                          New Password (optional)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Leave empty to keep current password"
                              className="pl-10 pr-10 h-10 border-2 border-gray-200 dark:border-gray-700 focus:border-red-500 dark:focus:border-red-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                              {...field}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <button
                              type="button"
                              tabIndex={-1}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

                {/* Bio - Full Width */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <FileText className="w-4 h-4 text-emerald-500" />
                          Professional Bio
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your experience, specialties, and professional background..."
                            className="min-h-[100px] resize-none border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-800 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Barber Profile
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

export default UpdateBarber;
