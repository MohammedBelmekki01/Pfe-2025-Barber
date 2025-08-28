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
import ClientApi from "@/Services/Api/ClientApi";

const formSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(60),
    addrees: z.string().min(2).max(255),
    phone: z.string().length(10, "Phone must be 10 digits"),
    password: z.string().min(2).max(255),

});

function UpdateClient({ client }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: client || {},
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const loading = toast.loading("Updating client...");
            const { data, status } = await ClientApi.update(client.id, values);
            toast.dismiss(loading);

            if (status === 200 || status === 201) {
                toast.success("Client updated successfully");
            }
        } catch (error: any) {
            toast.dismiss();
            console.error("Update error:", error);

            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                    form.setError(field as any, {
                        message: Array.isArray(messages) ? messages.join(', ') : messages,
                    });
                });
            } else {
                toast.error("Unexpected error occurred");
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
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
                                <Input placeholder="john@example.com" {...field} />
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
                                <Input placeholder="0612345678" {...field} />
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
                            <FormLabel>password</FormLabel>
                            <FormControl>
                                <Input placeholder="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full md:w-auto">
                    Update Client
                </Button>
            </form>
        </Form>
    );
}

export default UpdateClient;
