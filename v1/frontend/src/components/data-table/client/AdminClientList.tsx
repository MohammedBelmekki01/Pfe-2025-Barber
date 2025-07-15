"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Trash2Icon } from "lucide-react"

import { DataTable } from "../dataTable"
import { DataTableColumnHeader } from "../DataTableColumnHeader"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { toast } from "sonner"
import { Link } from "react-router-dom"
import UpdateClient from "@/components/Admin/FormClient/UpdateClient"
import ClientApi from "@/Services/Api/ClientApi"

export type Client = {
  id: number
  name: string
  email: string
  addrees: string
  phone: string
  formatted_updated_at?: string
}

function AdminClientList() {
  const [data, setData] = useState<Client[]>([])

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
      accessorKey: "addrees",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      cell: ({ row }) => (
        <div className="text-right font-medium">+212 {row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "formatted_updated_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original
        const [open, setOpen] = useState(false)

        return (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">Update</Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto max-w-lg">
                <SheetHeader>
                  <SheetTitle>Update Client</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <UpdateClient client={client} />
                </div>
              </SheetContent>
            </Sheet>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete <strong>{client.name}</strong>?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const loading = toast.loading("Deleting client...")
                      const { data: deletedData, status } = await ClientApi.delete(client.id)
                      toast.dismiss(loading)

                      if (status === 200) {
                        setData(data.filter((c) => c.id !== client.id))
                        toast.success("Client deleted", {
                          description: `Deleted ${deletedData?.data?.name}`,
                          icon: <Trash2Icon />,
                        })
                      }
                    }}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="secondary" className="w-full sm:w-auto">
              <Link to={`/admin/client-details?id=${client.id}`} className="text-emerald-600 hover:underline block w-full text-center">
                Details
              </Link>
            </Button>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    ClientApi.allclient().then(({ data }) => {
      setData(data.data)
    })
  }, [])

  return (
    <div className="p-4 overflow-x-auto">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default AdminClientList
