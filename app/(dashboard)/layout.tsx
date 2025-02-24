"use client";

import { AppSidebar } from "@/components/shared/app-sidebar";
import { Breadcrumbs } from "@/components/shared/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SearchInput from "@/components/shared/search-input";
import Kbar from "@/components/kbar";

export default function DashboardLayout({
  children,
  pageTitle = "Dashboard", 
  description = "Overview of the dashboard", 
}: {
  children: React.ReactNode;
  pageTitle?: string; 
  description?: string; 
}) {
  return (
    <Kbar>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 pl-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumbs />
            </div>
            <div className="mr-3">
              <SearchInput />
            </div>
          </header>
          <h1 className="text-2xl font-semibold mt-3 ml-7">{pageTitle}</h1> 
          
          {description && (
            <p className="text-sm text-muted-foreground mt-3 ml-3 px-4">{description}</p>
          )}

          <div className="flex flex-1 flex-col ml-3 mt-5 gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Kbar>
  );
}
