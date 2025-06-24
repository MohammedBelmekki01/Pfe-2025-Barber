import { zodResolver } from "@hookform/resolvers/zod"
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
import React from "react"

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
  password: z.string().min(6),
  bio: z.string().min(5).max(255),
  experience: z.string().min(1).max(100),
  location: z.string().min(2).max(255),
})

function CreateBarber() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      date_of_birth: "",
      gender: "m",
      addrees: "",
      phone: "",
      email: "",
      password: "",
      bio: "",
      experience: "",
      location: "",
    },
  })
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const loading = toast.loading("Creating barber...")
      const { status, data } = await BarberApiii.create(values)
      toast.dismiss(loading)

      if (status === 201) {
        toast.success("Barber created successfully", {
          description: data.message || "Barber has been added.",
        })
        form.reset()
      }
    } catch (error: any) {
      toast.dismiss()
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field as any, {
            message: Array.isArray(messages) ? messages.join(', ') : messages
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

        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
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
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

    <div className="flex flex-col gap-3 w-full">
      <Label htmlFor="date" className="px-1">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
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
          )}
        />

        <FormField
          control={form.control}
          name="addrees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
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
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="0612345678" inputMode="numeric" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input placeholder="Short biography" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input placeholder="3 years, 5 years..." {...field} />
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
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Casablanca, Agadir..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto">
          Create Barber
        </Button>
      </form>
    </Form>
  )
}

export default CreateBarber
