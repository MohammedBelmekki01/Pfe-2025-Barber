import { useUsercontext } from "@/context/UserContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Separator } from "../ui/separator"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import CreateClient from "./FormParentStudent/CreateClient"
import AdminClientList from "../data-table/client/AdminClientList"


export default function ManageClients() {
  const {user} = useUsercontext()
  return <>
    <div className="relative overflow-x-auto">
      <div className="hidden md:block">
        <div className="">
          <div className="bg-background">
            <div className="grid">
              <div className="col-span-3 lg:col-span-4">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="client_list" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="client_list" className="relative">
                          Client
                        </TabsTrigger>
                        <TabsTrigger value="add_client">Add new client</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent
                      value="client_list"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <AdminClientList />
                      </div>
                      <Separator className="my-4"/>
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                          </div>
                          <ScrollBar orientation="horizontal"/>
                        </ScrollArea>
                      </div>
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Made for You
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto
                          distinctio, ea placeat quia quos voluptas? Aperiam at aut culpa
                          laudantium. Ab culpa ea facere laboriosam officiis, porro quasi
                          sequi voluptatibus.
                        </p>
                      </div>
                      <Separator className="my-4"/>
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                          </div>
                          <ScrollBar orientation="horizontal"/>
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="add_client">
                      <div className="space-y-1">
                        <CreateClient />
                      </div>
                      <Separator className="my-4"/>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}