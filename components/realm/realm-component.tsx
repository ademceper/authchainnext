"use client";

import { JSX, useEffect, useReducer, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createRealm,
  deleteRealm,
  getRealms,
  updateRealm,
} from "@/app/(dashboard)/realm/service";
import { useDebounce } from "@/hooks/use-debounce";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Ellipsis, PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { RealmCreateRequest } from "@/app/(dashboard)/realm/models/realm.create.request";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import DataTable from "../shared/table/data-table";

type Item = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  isActive: boolean;
  realmType: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  expiresAt: string | null;
};

type PaginationAction = { type: "SET_PAGINATION"; payload: PaginationState };

const paginationReducer = (
  state: PaginationState,
  action: PaginationAction
): PaginationState => {
  switch (action.type) {
    case "SET_PAGINATION":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const RealmPage = () => {
  const [realms, setRealms] = useState<Item[]>([]);
  const [pagination, dispatchPagination] = useReducer(paginationReducer, {
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchName, setSearchName] = useState("");
  const [selectedRealm, setSelectedRealm] = useState<Item | null>(null);
  const [dialogType, setDialogType] = useState<"delete" | "toggle" | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [isActive, setIsActive] = useState<boolean | undefined>();
  const [refresh, setRefresh] = useState(0);
  const { toast } = useToast();
  const [orderBy, setOrderBy] = useState<{
    field: keyof Item;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });

  const debouncedSearch = useDebounce(searchName, 500);

  const form = useForm<z.infer<typeof RealmCreateRequest>>({
    resolver: zodResolver(RealmCreateRequest),
    defaultValues: selectedRealm
      ? {
          name: selectedRealm.name,
          description: selectedRealm.description || undefined,
          realmType: selectedRealm.realmType || undefined,
          expiresAt: selectedRealm.expiresAt
            ? new Date(selectedRealm.expiresAt)
            : undefined,
        }
      : {
          name: "",
          description: "",
          realmType: "",
          expiresAt: undefined,
        },
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRealms(
        { page: pagination.pageIndex + 1, limit: pagination.pageSize },
        debouncedSearch,
        isActive,
        orderBy
      );

      const transformedItems = data.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        expiresAt: item.expiresAt ? item.expiresAt.toISOString() : null,
      }));

      setRealms(transformedItems);
    };

    fetchData();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    isActive,
    orderBy,
    refresh,
  ]);

  useEffect(() => {
    if (selectedRealm) {
      form.setValue("name", selectedRealm.name);
      form.setValue("description", selectedRealm.description || undefined);
      form.setValue("realmType", selectedRealm.realmType || undefined);
      const expiresAt = selectedRealm.expiresAt
        ? new Date(selectedRealm.expiresAt)
        : undefined;
      form.setValue("expiresAt", expiresAt);
    } else {
      form.reset();
    }
  }, [selectedRealm, form]);

  const onSubmit = async (values: z.infer<typeof RealmCreateRequest>) => {
    try {
      let data;

      if (selectedRealm) {
        const updateRealmData = {
          id: selectedRealm.id,
          name: values.name,
          description: values.description,
          realmType: values.realmType,
          expiresAt: values.expiresAt,
        };
        data = await updateRealm(updateRealmData);

      } else {
        data = await createRealm(values);
      }

      if (data.success) {
        setOpenDialog(false);
        setRefresh((prev) => prev + 1);
        setSelectedRealm(null);
        toast({
          variant: "default",
          title: selectedRealm ? "Realm Updated" : "Realm Created",
          description: data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message,
        });
      }
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      toast({
        variant: "destructive",
        title: "Form validation failed",
        description: errMessage,
      });
    }
  };

  const handleDelete = async (
    id: string,
    softDelete: boolean,
    isActive: boolean
  ) => {
    try {
      const data = await deleteRealm(id, softDelete, !isActive);

      if (data.success) {
        toast({
          variant: "default",
          title: "Success",
          description: softDelete
            ? isActive
              ? "The realm has been disabled successfully."
              : "The realm has been enabled successfully."
            : data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message,
        });
      }

      setRefresh((prev) => prev + 1);
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      toast({
        variant: "destructive",
        title: "Form validation failed",
        description: errMessage,
      });
    }
  };

  const handleSort = (field: keyof Item) => {
    setOrderBy((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const addRealm = (): JSX.Element => {
    return (
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRealm(null);
          }
          setOpenDialog(open);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setOpenDialog(true)}>
            <PlusIcon
              className="mr-2 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Add Realm
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedRealm ? "Update Realm" : "Add New Realm"}
            </DialogTitle>
            <DialogDescription>
              {selectedRealm
                ? "Modify the details of the existing realm."
                : "Provide the necessary details to create a new realm."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Realm name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Realm description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="realmType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Realm Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Realm type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires At</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value).toLocaleDateString("en-CA")
                            : ""
                        }
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {selectedRealm ? "Update" : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };

  const columns: ColumnDef<Item>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      size: 180,
      enableSorting: true,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("description")}</div>
      ),
      size: 180,
      enableSorting: true,
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      size: 200,
      enableSorting: true,
      cell: ({ row }) => {
        const createdAt = new Date(row.getValue("createdAt"));
        return createdAt.toLocaleString();
      },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      size: 200,
      enableSorting: true,
      cell: ({ row }) => {
        const updatedAt = new Date(row.getValue("updatedAt"));
        return updatedAt.toLocaleString();
      },
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1.5">
          <span
            className={cn(
              row.getValue("isActive") ? "bg-emerald-500" : "bg-red-500",
              "size-1.5 rounded-full"
            )}
            aria-hidden="true"
          ></span>
          {row.getValue("isActive") ? "Active" : "Inactive"}
        </Badge>
      ),
      size: 120,
      enableSorting: true,
    },
    {
      header: "Created By",
      accessorKey: "createdBy",
      size: 200,
      enableSorting: true,
    },
    {
      header: "Updated By",
      accessorKey: "updatedBy",
      size: 200,
      enableSorting: true,
    },
    {
      header: "Expires At",
      accessorKey: "expiresAt",
      size: 200,
      enableSorting: true,
      cell: ({ row }) => {
        const updatedAt = new Date(row.getValue("expiresAt"));
        return updatedAt.toLocaleString();
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        const itemName = row.original.name;
        const handleAction = () => {
          if (dialogType === "delete") {
            handleDelete(row.original.id, false, row.original.isActive);
          } else if (dialogType === "toggle") {
            handleDelete(row.original.id, true, row.original.isActive);
          }
        };

        return (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shadow-none"
                    aria-label="Actions"
                  >
                    <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedRealm(row.original);
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>

                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className={cn(
                        isActive && "text-destructive focus:text-destructive"
                      )}
                      onClick={() => setDialogType("toggle")}
                    >
                      {isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDialogType("delete")}
                  >
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogType === "delete" ? (
                    <>
                      This action cannot be undone. This will permanently delete{" "}
                      <strong>{itemName}</strong> and remove its data from our
                      servers.
                    </>
                  ) : (
                    <>
                      Are you sure you want to{" "}
                      <strong>{isActive ? "deactivate" : "activate"}</strong>{" "}
                      the user <strong>{itemName}</strong>?
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAction}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
      size: 60,
      enableHiding: false,
    },
  ];

  return (
    <DataTable<Item>
      addButton={addRealm()}
      payload={realms}
      pagination={pagination}
      setPagination={(newPagination) =>
        dispatchPagination({ type: "SET_PAGINATION", payload: newPagination })
      }
      searchName={searchName}
      setSearchName={setSearchName}
      isActive={isActive}
      setIsActive={setIsActive}
      orderBy={orderBy}
      onSort={handleSort}
      columns={columns}
    />
  );
  
};

export default RealmPage;
