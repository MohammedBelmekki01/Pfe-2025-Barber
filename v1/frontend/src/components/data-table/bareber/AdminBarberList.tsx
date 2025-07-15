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
import BarberApiii from "@/Services/Api/BarbersApiA/BarberApi"
import { Link } from "react-router-dom"
import UpdateBarber from "@/components/Admin/FormBarber/UpdateBarber"

export type Barber = {
  id: number
  firstname: string
  lastname: string
  date_of_birth: string
  gender: string
  addrees: string
  phone: string
  email: string
  bio: string
  experience: string
  location: string
  formatted_updated_at: string
}

function AdminBarberList() {
  const [data, setData] = useState<Barber[]>([])
  

  const columns: ColumnDef<Barber>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    },
    {
      accessorKey: "firstname",
      header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
    },
    {
      accessorKey: "lastname",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
    },
    {
      accessorKey: "date_of_birth",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Birth Date" />,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
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
      accessorKey: "bio",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bio" />,
    },
    {
      accessorKey: "experience",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Experience" />,
    },
    {
      accessorKey: "location",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    },
        {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    },
    {
      accessorKey: "formatted_updated_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const barber = row.original
        const [open, setOpen] = useState(false)

        return (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">Update</Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto max-w-lg">
                <SheetHeader>
                  <SheetTitle>Update Barber</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <UpdateBarber barber={barber} />
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
                    Delete <strong>{barber.firstname} {barber.lastname}</strong>?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const loading = toast.loading("Deleting barber...")
                      const { status } = await BarberApiii.delete(barber.id)
                      toast.dismiss(loading)

                      if (status === 200) {
                        setData(data.filter((b) => b.id !== barber.id))
                        toast.success("Barber deleted", {
                          description: `${barber.firstname} ${barber.lastname} has been removed.`,
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
          <Link to={`/admin/barber-details?id=${barber.id}`} className="text-emerald-600 hover:underline block w-full text-center">
            Details
          </Link>
        </Button>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    BarberApiii.allBarbers().then(({ data }) => {
      setData(data.data)
    })
  }, [])

  return (
    <div className="p-4 overflow-x-auto">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default AdminBarberList
