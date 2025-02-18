"use client";

import * as React from "react";
import { ChevronsUpDown, MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { RealmService } from "@/services/realmService";
import { Realm } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

export function RealmSwitcher() {
  const { toast } = useToast();
  const { isMobile } = useSidebar();
  const [realm, setRealm] = useState<{ name: string }>({ name: "No Realm" });
  const [realms, setRealms] = useState<Realm[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRealmName, setNewRealmName] = useState("");
  const [newRealmDescription, setNewRealmDescription] = useState("");
  const [editingRealm, setEditingRealm] = useState<Realm | null>(null);
  const [deletingRealm, setDeletingRealm] = useState<Realm | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadRealms = async () => {
      try {
        const data = await RealmService.getAllRealms();
        setRealms(data);
        if (data.length > 0) {
          setRealm(data[0]);
        }
      } catch (error) {
        console.error("Error loading realms:", error);
      }
    };

    loadRealms();
  }, []);

  const handleAddOrUpdateRealm = async () => {
    if (!newRealmName.trim()) {
      toast({
        title: "Error",
        description: "Realm name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { success, message } = editingRealm
        ? await RealmService.updateRealm({
            id: editingRealm.id,
            name: newRealmName.trim(),
            description: newRealmDescription.trim(),
          })
        : await RealmService.createRealm({
            name: newRealmName.trim(),
            description: newRealmDescription.trim(),
          });

      if (success) {
        const data = await RealmService.getAllRealms();
        setRealms(data);
        setRealm(data.find((r) => r.id === (editingRealm?.id ?? data[0]?.id)) || { name: "No Realm" });

        toast({
          title: `${editingRealm ? "Realm Updated" : "Realm Added"}`,
          description: `The realm "${newRealmName.trim()}" was successfully ${editingRealm ? "updated" : "added"}.`,
          variant: "default",
        });
      } else {
        throw new Error(message || "Unknown error");
      }

      setIsDialogOpen(false);
      setNewRealmName("");
      setNewRealmDescription("");
      setEditingRealm(null);
    } catch (error) {
      console.error("Failed to process realm:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an issue processing the request.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRealm = async () => {
    if (!deletingRealm) return;

    try {
      await RealmService.deleteRealm(deletingRealm.id);
      setRealms(realms.filter((r) => r.id !== deletingRealm.id));
      if (realm?.name === deletingRealm.name) {
        setRealm(realms.length > 1 ? realms[0] : { name: "No Realm" });
      }

      toast({
        title: "Realm Deleted",
        description: `The realm ${deletingRealm.name} was deleted successfully.`,
        variant: "default",
      });

      setIsDeleteDialogOpen(false);
      setDeletingRealm(null);
    } catch (error) {
      console.error("Failed to delete realm:", error);
      toast({
        title: "Error",
        description: "There was an issue deleting the realm.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight justify-center">
                <span className="truncate font-semibold">{realm?.name || "No Realm Selected"}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Realms
            </DropdownMenuLabel>
            {realms.map((realm) => (
              <DropdownMenuItem
                key={realm.id}
                onClick={() => setRealm(realm)}
                className="gap-2 p-2 hover:cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{realm.name}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingRealm(realm);
                          setNewRealmName(realm.name);
                          setNewRealmDescription(realm.description || "");
                          setIsDialogOpen(true);
                        }}
                        className="hover:cursor-pointer"
                      >
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setDeletingRealm(realm);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2 hover:cursor-pointer"
              onClick={() => {
                setEditingRealm(null);
                setNewRealmName("");
                setNewRealmDescription("");
                setIsDialogOpen(true);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add Realm</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRealm ? "Update Realm" : "Add New Realm"}</DialogTitle>
            <DialogDescription>
              {editingRealm
                ? "Update the name and description for this realm."
                : "Provide the name and description for the new realm."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newRealmName}
                onChange={(e) => setNewRealmName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newRealmDescription}
                onChange={(e) => setNewRealmDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddOrUpdateRealm}>
              {editingRealm ? "Update Realm" : "Add Realm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this realm?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteRealm}>
              Delete
            </Button>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}
