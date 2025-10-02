import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CalendarIcon,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Lock,
  Calendar as CalendarLucide,
  Star,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Sparkles,
} from "lucide-react";
import emailjs from "@emailjs/browser";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Assuming BarberApiii is correctly imported and configured
import BarberApiii from "@/Services/Api/BarbersApiA/BarberApi";
import { UserApi } from "@/Services/Api/Barber/UserApi";
import { useNavigate } from "react-router-dom";
import { ROUTE_LOGIN } from "@/router";

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
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().min(5, "Bio must be at least 5 characters").max(255),
  experience: z.string().min(1, "Experience is required").max(100),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(255),
  image: z
    .any()
    .refine((file) => !file || file instanceof File, "Invalid file")
    .optional(),
});

function CreateBarberRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
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

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
const [preview, setPreview] = useState<string | undefined>(undefined);
  // Update form when date changes
  useEffect(() => {
    if (date) {
      form.setValue("date_of_birth", format(date, "yyyy-MM-dd"));
    }
  }, [date, form]);

  const steps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Let's start with your basic details",
      icon: User,
      fields: ["firstname", "lastname", "date_of_birth", "gender"],
    },
    {
      id: 2,
      title: "Contact Details",
      description: "How can clients reach you?",
      icon: Mail,
      fields: ["email", "phone", "addrees", "location"],
    },
    {
      id: 3,
      title: "Professional Profile",
      description: "Tell us about your expertise",
      icon: Scissors,
      fields: ["experience", "bio", "password"],
    },
  ];

  const currentStepData =
    steps.find((step) => step.id === currentStep) || steps[0];

  const validateCurrentStep = async () => {
    const fieldsToValidate = currentStepData.fields;
    let isValid = true;

    for (const field of fieldsToValidate) {
      const result = await form.trigger(field as any);
      if (!result) isValid = false;
    }

    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      await UserApi.getCsrfToken();

      // Créer un FormData
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "image" && value instanceof File) {
            formData.append("image", value);
          } else {
            formData.append(key, value as any);
          }
        }
      });

      const { status, data } = await BarberApiii.createGeust(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (status === 201) {
        // Envoyer l'email via EmailJS
        emailjs.send(
          "service_rltuuw5", // ex: "service_xxxxx"
          "template_xfmim7j", // ex: "template_xxxxx"
          {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            phone: values.phone,
            // Ajoutez d'autres variables selon votre template
          },
          "QwlOI3Iw4LFURPxVj" // ex: "user_xxxxx"
        ).then(
          () => {
            toast.success("Email de bienvenue envoyé !");
          },
          (error) => {
            toast.error("Erreur lors de l'envoi de l'email");
          }
        );

        toast.success("Bienvenue dans la communauté des barbiers ! 🎉", {
          description: "Votre profil a été créé avec succès.",
        });
        form.reset();
        navigate(ROUTE_LOGIN);
        setDate(undefined);
        setPreview(undefined);
      }
    } catch (error: unknown) {
      setIsSubmitting(false);
      toast.dismiss();
      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = error as any;
        if (errorResponse.response?.data?.errors) {
          Object.entries(errorResponse.response.data.errors).forEach(
            ([field, messages]) => {
              form.setError(field as keyof z.infer<typeof formSchema>, {
                message: Array.isArray(messages)
                  ? messages.join(", ")
                  : (messages as string),
              });
            }
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Join Our Barber Community
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Create your professional profile in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${currentStep >= step.id
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 border-emerald-500 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                    }`}
                >
                  <step.icon className="w-5 h-5" />
                  {currentStep > step.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-all duration-300 ${currentStep > step.id
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500"
                        : "bg-gray-200 dark:bg-gray-700"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-900/20 dark:to-blue-900/20 p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <currentStepData.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentStepData.title}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {currentStepData.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  placeholder="John"
                                  className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  placeholder="Doe"
                                  className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="date_of_birth"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
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
                                    className="w-full h-12 justify-start text-left font-normal border-0 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                                  >
                                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                                    {date
                                      ? format(date, "PPP")
                                      : "Select your birth date"}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0 border-0 shadow-2xl rounded-2xl"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={(selectedDate) => {
                                    setDate(selectedDate);
                                    setIsCalendarOpen(false);
                                  }}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                  className="rounded-2xl"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Gender
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300">
                                  <SelectValue placeholder="Select your gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-0 shadow-2xl rounded-2xl">
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
                )}

                {/* Step 2: Contact Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  type="email"
                                  placeholder="john@example.com"
                                  className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  placeholder="0612345678"
                                  inputMode="numeric"
                                  className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="addrees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Home Address
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  placeholder="123 Main Street"
                                  className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Work Location
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  placeholder="Casablanca, Agadir..."
                                  className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Profile Image
                            </FormLabel>
                            <FormControl>
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    field.onChange(file);
                                    if (file) {
                                      setPreview(URL.createObjectURL(file));
                                    } else {
                                      setPreview(undefined);
                                    }
                                  }}
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-emerald-500 file:text-white
              hover:file:bg-emerald-600 transition-all"
                                />
                                {preview && (
                                  <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-2 w-24 h-24 object-cover rounded-full border"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Professional Profile */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Years of Experience
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  placeholder="5 years, 10+ years..."
                                  className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  type="password"
                                  placeholder="Create a strong password"
                                  className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                            Professional Bio
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                              <Textarea
                                placeholder="Tell clients about your experience, specialties, and what makes you unique as a barber..."
                                className="pl-10 min-h-[120px] border-0 bg-gray-50 dark:bg-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1">
                      Step {currentStep} of {steps.length}
                    </Badge>
                  </div>

                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Create My Profile
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate(ROUTE_LOGIN)}
              className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all duration-200"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateBarberRegister;