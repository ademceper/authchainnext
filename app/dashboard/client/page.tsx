import DashboardLayout from "../page";

export default function ClientPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Client Page</h1>
        <p>Welcome to the client section of the dashboard!</p>
        {/* Buraya istediğiniz içeriği ekleyebilirsiniz */}
      </div>
    </DashboardLayout>
  );
}
