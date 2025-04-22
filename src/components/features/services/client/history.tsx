"use client";

import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  flexRender,
} from "@tanstack/react-table";

import { z } from "zod";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ColumnsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Schéma pour validation
export const schema = z.object({
  id: z.string(),
  price: z.number(),
  provider: z.object({
    id: z.string(),
    name: z.string(),
    photo: z.string(),
  }),
  date: z.string(),
  service_name: z.string(),
  rate: z.number(),
});

export const columnLink = [
  { column_id: "provider.name", text: "Prestataire" },
  { column_id: "service_name", text: "Service" },
  { column_id: "rate", text: "Note" },
  { column_id: "price", text: "Prix (€)" },
  { column_id: "date", text: "Date" },
];

export const columns = (): ColumnDef<z.infer<typeof schema>>[] => {
  const navigate = useNavigate();

  return [
    {
      id: "provider",
      accessorKey: "provider.name",
      header: "Prestataire",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={row.original.provider.photo} />
            <AvatarFallback>{row.original.provider.name[0]}</AvatarFallback>
          </Avatar>
          <span>{row.original.provider.name}</span>
        </div>
      ),
      enableHiding: false,
    },
    { accessorKey: "service_name", header: "Service" },
    { accessorKey: "rate", header: "Note" },
    {
      accessorKey: "price",
      header: "Prix (€)",
      cell: ({ row }) => `${row.original.price.toFixed(2)} €`,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/office/service/${row.original.id}`)}
        >
          Voir
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
