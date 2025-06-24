import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import BarberApiii from "@/Services/Api/BarbersApiA/BarberApi"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

const formSchema = z.object({
  firstname: z.string().min(2).max(100),
  lastname: z.string().min(2).max(100),
  date_of_birth: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  gender: z.enum(["m", "f"]),
  addrees: z.string().min(2).max(255),
  phone: z.string().length(10, "Phone must be 10 digits"),
  email: z.string().email().max(60),
  password: z.string().optional(), // Not required for update
  bio: z.string().min(5).max(255),
  experience: z.string().min(1).max(100),
  location: z.string().min(2).max(255),
})

function UpdateBarber({ barber }: { barber: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...barber,
      password: "",
    },
  })

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(
    barber?.date_of_birth ? new Date(barber.date_of_birth) : undefined
  )

  useEffect(() => {
    if (date) {
      form.setValue("date_of_birth", date.toISOString().split("T")[0])
    }
  }, [date, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const loading = toast.loading("Updating barber...")
      const { status, data } = await BarberApiii.update(barber.id, values)
      toast.dismiss(loading)

      if (status === 200 || status === 201) {
        toast.success("Barber updated successfully", {
          description: data.message || "Barber has been updated.",
        })
      }
    } catch (error: any) {
      toast.dismiss()
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            message: Array.isArray(messages) ? messages.join(", ") : messages,
          })
        })
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField control={form.control} name="firstname" render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="lastname" render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex flex-col gap-3 w-full">
          <Label>Date of Birth</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-48 justify-between font-normal">
                {date ? date.toLocaleDateString() : "Select date"} <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(selected) => {
                  if (selected) {
                    setDate(selected)
                    setOpen(false)
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <FormField control={form.control} name="gender" render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <select {...field} className="border rounded p-2 w-full">
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="addrees" render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>New Password (optional)</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="bio" render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="experience" render={({ field }) => (
          <FormItem>
            <FormLabel>Experience</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full md:w-auto">
          Update Barber
        </Button>
      </form>
    </Form>
  )
}

export default UpdateBarber
