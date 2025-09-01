import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Eye,
  EyeOff,
  User,
  Mail,
  MapPin,
  Phone,
  Lock,
  Briefcase,
  FileText,
  UserPlus,
} from "lucide-react";
import { format } from "date-fns";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarberApiii from "@/Services/Api/BarbersApiA/BarberApi";

const formSchema = z.object({
  firstname: z.string().min(2).max(100),
  lastname: z.string().min(2).max(100),
  date_of_birth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  gender: z.enum(["m", "f"]),
  addrees: z.string().min(2).max(255),
  phone: z.string().length(10),
  email: z.string().email().max(60),
  password: z.string().min(6),
  bio: z.string().min(5).max(255),
  experience: z.string().min(1).max(100),
  location: z.string().min(2).max(255),
});

interface CreateBarberProps {
  onBarberCreated?: () => void;
}

const CreateBarber: React.FC<CreateBarberProps> = ({ onBarberCreated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      date_of_birth: "",
      gender: undefined,
      addrees: "",
      phone: "",
      email: "",
      password: "",
      bio: "",
      experience: "",
      location: "",
    },
  });

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    if (date) {
      form.setValue("date_of_birth", format(date, "yyyy-MM-dd"));
    }
  }, [date, form]);

  const onSubmit = async (values: any) => {
    try {
      const loading = toast.loading("Creating barber...");
      const { status, data } = await BarberApiii.create(values);
      toast.dismiss(loading);
      if (status === 201) {
        toast.success("Barber created successfully");
        form.reset();
        setDate(undefined);
        if (onBarberCreated) onBarberCreated();
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Create New Barber
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                Add a professional barber with complete profile information
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4 text-blue-500" />
                            First Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter first name"
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

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4 text-blue-500" />
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter last name"
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
                </div>

                {/* Date and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <CalendarIcon className="w-4 h-4 text-green-500" />
                            Date of Birth
                          </FormLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full h-12 justify-start text-left font-normal bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 rounded-xl backdrop-blur-sm transition-all duration-200"
                                >
                                  <CalendarIcon className="mr-3 h-4 w-4 text-gray-400" />
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
                                  setOpen(false);
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
                            <User className="w-4 h-4 text-purple-500" />
                            Gender
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                {/* Address and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="addrees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            Home Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter home address"
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

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            Work Location
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter work location"
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
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Briefcase className="w-4 h-4 text-amber-500" />
                            Experience
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="e.g., 5 years"
                                className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                                {...field}
                              />
                              <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                                placeholder="Create secure password"
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
                </div>

                {/* Bio - Full Width */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          Professional Bio
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your experience, specialties, and professional background..."
                            className="min-h-[120px] resize-none border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                            {...field}
                          />
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
                    className="w-full h-14 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:via-orange-700 hover:to-amber-800 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Barber Profile
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBarber;