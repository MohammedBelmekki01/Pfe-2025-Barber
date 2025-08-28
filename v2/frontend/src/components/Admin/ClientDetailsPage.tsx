import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import axiosClient from "@/api/axios";
import ClientDetails from "./FromClient/ClientDetails";

export type Client = {
  id: number;
  name: string;
  email: string;
  addrees: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
};

export default function ClientDetailsPage() {
  const location = useLocation();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get("id");

    const fetchClient = async () => {
      if (!clientId) {
        setLoading(false);
        setError("No client ID provided in the URL.");
        toast.error("Missing ID", {
          description: "Please use /client-details?id=1",
        });
        return;
      }

      setLoading(true);
      const loadingToast = toast.loading("Fetching client details...");

      try {
        const response = await axiosClient.get(`/api/admin/clients/${clientId}`);
        setClient(response.data);
        toast.dismiss(loadingToast);
        toast.success("Client loaded successfully!");
      } catch (err: any) {
        toast.dismiss(loadingToast);
        setError(err?.response?.data?.message || "Failed to fetch client.");
        toast.error("Error", {
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading client details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Client not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ClientDetails client={client} />
    </div>
  );
}
