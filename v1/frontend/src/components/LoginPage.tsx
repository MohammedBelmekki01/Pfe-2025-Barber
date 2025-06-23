
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axios';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';
import { useUsercontext } from '@/context/UserContext';
import { redirectToDashboard } from '@/router';
const formSchema = z.object({
  email: z.string().min(2),
  password: z.string().min(8)
})

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "test@example.com",
      password: "123456789"
    },
  })

  const { isSubmitting } = form.formState
  const navigate = useNavigate();
  const { login, user, setAuthenticated , authenticated, setToken } = useUsercontext()
//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//   try {
//     const response = await login(values.email, values.password);

//     if (response && (response.status === 200 || response.status === 204)) {
//       setAuthenticated(true);
//       localStorage.setItem("token", response.data.access_token);
//       console.log("login " + authenticated);
//       navigate(BARBER_DASHBOARD_ROUTE);
      
      
//     }
//   } catch ({ response }: any) {
//     form.setError('email', {
//       message: response?.data?.message ?? "Login failed"
//     });
//   }
// };

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const response = await login(values.email, values.password);

if (response && response.status === 200 && response.data?.user) {
      console.log(response);
      console.log(response.data.user.role);
      console.log(response.data.token);
      
      setToken(response.data.token)
        navigate(redirectToDashboard(response.data.user.role)) ;
      
      
      setAuthenticated(true);

    } else {
      console.log("Login failed response:", response);
      form.setError("email", {
      message: response?.data?.message ?? "Invalid credentials",
    });
    }
  } catch ({ response }: any) {
    console.log(response)
    
  }
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 />}
          Submit</Button>
      </form>
    </Form>
  );
}
