"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { User, Mail, Phone, MapPin, Lock, UserPlus, ChevronRight, ArrowLeft, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import ClientApi from "@/Services/Api/ClientApi"
import { useNavigate } from "react-router-dom"
import { ROUTE_LOGIN } from "@/router"
import { UserApi } from "@/Services/Api/Barber/UserApi"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(60),
  addrees: z.string().min(2, "addrees must be at least 2 characters").max(255),
  phone: z.string().length(10, "Phone must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters").max(255).optional(),
})

type FormValues = z.infer<typeof formSchema>

function CreateClientRegister() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigation = useNavigate()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      addrees: "",
      phone: "",
      password: "",
    },
  })

  const steps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Let's start with your basic details",
      icon: User,
      fields: ["name", "email"],
    },
    {
      id: 2,
      title: "Contact Details",
      description: "How can we reach you?",
      icon: Phone,
      fields: ["phone", "addrees"],
    },
    {
      id: 3,
      title: "Security",
      description: "Create your account password",
      icon: Lock,
      fields: ["password"],
    },
  ]

  const currentStepData = steps.find((step) => step.id === currentStep) || steps[0]

  const validateCurrentStep = async () => {
    const fieldsToValidate = currentStepData.fields
    const results = await Promise.all(
      fieldsToValidate.map((field) => form.trigger(field as keyof FormValues))
    )
    return results.every(Boolean)
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)
      const loadingToast = toast.loading("Creating your account...")
      await UserApi.getCsrfToken()
      const { status, data } = await ClientApi.createForRegister(values)
      toast.dismiss(loadingToast)

      if (status === 201) {
        toast.success("Welcome! 🎉", {
          description: "Your account has been created successfully.",
        })
        form.reset()
        navigation(ROUTE_LOGIN)
      }
    } catch (error: any) {
      toast.dismiss()
      console.error("Error:", error)
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field as keyof FormValues, {
            message: Array.isArray(messages) ? messages[0] : messages as string,
          })
        })
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepIcon = (fieldName: string) => {
    switch (fieldName) {
      case "name": return <User className="w-5 h-5 text-gray-400" />
      case "email": return <Mail className="w-5 h-5 text-gray-400" />
      case "phone": return <Phone className="w-5 h-5 text-gray-400" />
      case "addrees": return <MapPin className="w-5 h-5 text-gray-400" />
      case "password": return <Lock className="w-5 h-5 text-gray-400" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-10">
          <div className="inline-block p-1 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl backdrop-blur-sm mb-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Create Your Account
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join our community and experience exceptional barber services tailored just for you
          </p>
        </div>

        {/* Enhanced Progress Steps */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4 relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-700 -z-10" />
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div
                  className={`
                    relative flex items-center justify-center w-14 h-14 rounded-2xl 
                    transition-all duration-300 border-2
                    ${currentStep >= step.id 
                      ? "bg-gradient-to-tr from-purple-600 to-blue-600 border-transparent text-white shadow-lg shadow-purple-500/25"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
                    }
                    ${currentStep === step.id && "ring-4 ring-purple-500/20"}
                  `}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 
                  ${currentStep >= step.id 
                    ? "text-gray-900 dark:text-white" 
                    : "text-gray-500 dark:text-gray-400"
                  }`}>
                  Step {step.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Form Card */}
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-purple-900/20 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                <currentStepData.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentStepData.title}
                </CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-1">
                  {currentStepData.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
                  {currentStepData.fields.map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName as keyof FormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                            {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-focus-within:scale-110">
                                {getStepIcon(fieldName)}
                              </span>
                              <Input
                                {...field}
                                type={fieldName === "password" ? "password" : "text"}
                                placeholder={`Enter your ${fieldName}`}
                                className="h-14 pl-12 bg-gray-50 dark:bg-gray-700/50 border-0 ring-2 ring-gray-200 dark:ring-gray-700 
                                  focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-500 rounded-xl transition-shadow duration-300
                                  placeholder:text-gray-400 dark:placeholder:text-gray-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 dark:text-rose-400" />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {/* Enhanced Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2 h-12 px-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                  ) : <div />}

                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 
                        hover:to-blue-700 text-white rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl 
                        hover:shadow-purple-500/35 transition-all duration-300 ml-auto"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 
                        hover:to-blue-700 text-white rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl 
                        hover:shadow-purple-500/35 transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none ml-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Create Account
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Enhanced Login Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigation(ROUTE_LOGIN)}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 
                        font-semibold hover:underline transition-all duration-200"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateClientRegister