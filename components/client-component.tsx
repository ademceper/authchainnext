import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClientTable from "./client-table"
import ConsentTable from "./consent-table"
import AuthorizedUsersTable from "./authorized-user-table"
import AccessTokenTable from "./access-token-table"
import IdTokenTable from "./id-token-table"

export default function ClientComponent() {
  return (
    <Tabs defaultValue="tab-1" orientation="vertical" className="flex w-full gap-2">
      <TabsList className="flex-col">
        <TabsTrigger value="tab-1" className="w-full">
          Clients
        </TabsTrigger>
        <TabsTrigger value="tab-2" className="w-full">
          Consents
        </TabsTrigger>
        <TabsTrigger value="tab-3" className="w-full">
          Authorized Users
        </TabsTrigger>
        <TabsTrigger value="tab-4" className="w-full">
          Access Tokens
        </TabsTrigger>
        <TabsTrigger value="tab-5" className="w-full">
          Id Tokens
        </TabsTrigger>
      </TabsList>
      <div className="grow rounded-lg text-start">
        <TabsContent value="tab-1">
          <ClientTable/>
        </TabsContent>
        <TabsContent value="tab-2">
          <ConsentTable/>
        </TabsContent>
        <TabsContent value="tab-3">
          <AuthorizedUsersTable/>
        </TabsContent>
        <TabsContent value="tab-4">
          <AccessTokenTable/>
        </TabsContent>
        <TabsContent value="tab-5">
          <IdTokenTable/>
        </TabsContent>
      </div>
    </Tabs>
  )
}

