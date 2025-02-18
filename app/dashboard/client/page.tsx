import DashboardLayout from "../page";
import ClientComponent from "@/components/client-component";

export default function ClientPage() {
  return (
    <DashboardLayout 
      pageTitle="Client Management" 
      description="Manage and view all client-related information and activities."
    >
        <ClientComponent/>
    </DashboardLayout>
  );
}
