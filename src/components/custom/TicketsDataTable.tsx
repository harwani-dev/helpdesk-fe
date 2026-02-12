"use client"

import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { Ticket } from "@/types/ticket"
import { useAuth } from "@/hooks/useAuth"
import Modal from "./Modal"

interface TicketsDataTableProps {
    data: Ticket[]
}

export default function TicketsDataTable({ data }: TicketsDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        [],
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { userType: role } = useAuth()
    const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)

    const columns = React.useMemo<ColumnDef<Ticket>[]>(() => {
        const cols: ColumnDef<Ticket>[] = [
            {
                accessorKey: "status",
                header: "Status",
                accessorFn: (row) => {
                    const status = row.status
                    return status.replace(/_/g, " ");

                },
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("status")}</div>
                ),
            },
            {
                accessorKey: "title",
                header: "Title",
                cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
            },
            {
                id: "request_type",
                header: "Request Type",
                accessorFn: (row) => {
                    const type = row.ticketType
                    const subtype = row.ticketType === "IT" ? row.itType : row.hrType
                    return `${type}${subtype ? ` - ${subtype.replace(/_/g, " ")}` : ""}`
                },
                cell: ({ getValue }) => <div className="capitalize">{getValue() as string}</div>,
            }
        ]

        if (role === "ADMIN") {
            cols.push({
                accessorKey: "createdBy.email",
                id: "email",
                header: ({ column }) => {
                    return (
                        <Button
                            className="bg-secondary-background border-none cursor-pointer"
                            variant="noShadow"
                            size="sm"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    )
                },
                cell: ({ row }) => <div className="lowercase">{row.original.createdBy?.email}</div>,
            })
        }

        cols.push({
            accessorKey: "createdAt",
            header: () => <div className="text-right hidden md:table-cell">Created At</div>,
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"))
                return <div className="text-right font-medium hidden md:table-cell">{date.toLocaleDateString()}</div>
            },
        })

        return cols
    }, [role])

    const canWorkOnTicket = React.useCallback(
        (ticket: Ticket) => {
            if (role === "HR") return ticket.status === "FORWARDED_TO_HR"
            if (role === "IT") return ticket.status === "FORWARDED_TO_IT"
            return true
        },
        [role],
    )

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full lg:w-[1024px] font-base text-main-foreground">
            <div className="flex justify-end items-center py-4 gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="noShadow" className="ml-2 cursor-pointer">
                            <Filter className="mr-2 h-4 w-4" />
                            Status
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {["FORWARDED_TO_HR", "FORWARDED_TO_IT", "FORWARDED_TO_MANAGER", "RESOLVED", "REJECTED", "CLOSED"].map((status) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    className="capitalize"
                                    checked={(table.getColumn("status")?.getFilterValue() as string[])?.includes(status)}
                                    onCheckedChange={(checked) => {
                                        const column = table.getColumn("status")
                                        const filterValue = (column?.getFilterValue() as string[]) || []
                                        if (checked) {
                                            column?.setFilterValue([...filterValue, status])
                                        } else {
                                            column?.setFilterValue(
                                                filterValue.filter((value) => value !== status)
                                            )
                                        }
                                    }}
                                >
                                    {status.replace(/_/g, " ")}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="noShadow">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id.replace(/_/g, " ")}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="border-2 rounded-xl">
                <Table>
                    <TableHeader className="font-heading">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                className="bg-secondary-background text-foreground hover:bg-secondary-background"
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className="text-foreground" key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const clickable = canWorkOnTicket(row.original)
                                return (
                                    <TableRow
                                        className={`bg-secondary-background text-foreground data-[state=selected]:bg-main data-[state=selected]:text-main-foreground hover:bg-muted/50 ${clickable ? "cursor-pointer" : "cursor-default"}`}
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => clickable && setSelectedTicket(row.original)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell className="px-4 py-2" key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-foreground flex-1 text-sm">
                </div>
                <div className="space-x-2">
                    <Button
                        variant="noShadow"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="noShadow"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <Modal
                ticket={selectedTicket}
                open={!!selectedTicket}
                onOpenChange={(open) => !open && setSelectedTicket(null)}
                onSuccess={() => { }}
            />
        </div>
    )
}
