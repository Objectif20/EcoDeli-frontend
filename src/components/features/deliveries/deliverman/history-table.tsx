"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ColumnsIcon,
  ChevronDownIcon,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

// Schéma Zod pour la nouvelle structure des données
export const schema = z.object({
  id: z.string(),
  departure_city: z.string(),
  arrival_city: z.string(),
  price: z.number(),
  client: z.object({
    name: z.string(),
    photo_url: z.string(),
  }),
  status: z.string(),
});

export const columnLink = [
  { column_id: "departure_city", text: "Ville de départ" },
  { column_id: "arrival_city", text: "Ville d'arrivée" },
  { column_id: "price", text: "Prix" },
  { column_id: "status", text: "Statut" },
];

export const columns = (): ColumnDef<z.infer<typeof schema>>[] => {
    const navigate = useNavigate();


  return [
    {
      id: "client",
      accessorKey: "client.name",
      header: "Client",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={row.original.client.photo_url} />
            <AvatarFallback>{row.original.client.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <span>{row.original.client.name}</span>
          </div>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "departure_city",
      header: "Ville de départ",
      cell: ({ row }) => <span>{row.original.departure_city}</span>,
    },
    {
      accessorKey: "arrival_city",
      header: "Ville d'arrivée",
      cell: ({ row }) => <span>{row.original.arrival_city}</span>,
    },
    {
      accessorKey: "price",
      header: "Prix",
      cell: ({ row }) => <span>{row.original.price} €</span>,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => <span>{row.original.status}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button onClick={() => navigate(`/office/deliveries/public/${row.original.id}`)}>
            Détails
        </Button>
      ),
    },
  ];
};

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: columns(),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex justify-end items-center gap-2 w-full my-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Colonnes</span>
                <span className="lg:hidden">Colonnes</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  const columnLinkItem = columnLink.find(
                    (link) => link.column_id === column.id
                  );
                  const displayText = columnLinkItem
                    ? columnLinkItem.text
                    : column.id;

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {displayText}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
