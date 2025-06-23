import { useEffect, useState } from "react"
import { DataTable } from "../dataTable"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "../DataTableColumnHeader"
import {  Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import UpdateClient from "@/components/Admin/FormParentStudent/UpdateClient"
import ClientApi from "@/Services/Api/ClientApi"

export type Client = {
    id: number
    firstname: string
    lastname: string
    date_of_birth: string
    gender: string
    blood_type: string
    addrees: string
    phone: number
    email: string
}

function AdminClientList() {
    const [data, setData] = useState([])
const AdminClientColumn: ColumnDef<Client>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "addrees",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Address" />
        ),
    },
  {
    accessorKey: "formatted_updated_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
  },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => {
            const phone = row.getValue("phone")
            return <div className="text-right font-medium">+212 {phone}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { id, name } = row.original
            const [open, setopen] = useState(false)

            return (
                <>
                    <Sheet open={open} onOpenChange={setopen}>
                        <SheetTrigger asChild>
                            <Button variant="outline">Update</Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                            <div className="grid gap-6 px-4">
                                <UpdateClient client={row.original} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure you want to delete <span className="font-bold">{name}</span>?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={async () => {
                                    const loading = toast.loading('Deleting client...')
                                    const { data: deletedData, status } = await ClientApi.delete(id)
                                    toast.dismiss(loading)

                                    if (status === 200) {
                                        setData(data.filter((client) => client.id !== id))
                                        toast.success('Client deleted successfully', {
                                            description: `Deleted ${deletedData.data.name}`,
                                            icon: <Trash2Icon />
                                        })
                                    }
                                }}>
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )
        },
    },
]


    useEffect(() => {
        ClientApi.allclient().then(({ data }) => {
            setData(data.data)
            console.log(data.data);

        })
    }, [])
    return (
        <div>
            <DataTable columns={AdminClientColumn} data={data} />
        </div>
    )
}

export default AdminClientList