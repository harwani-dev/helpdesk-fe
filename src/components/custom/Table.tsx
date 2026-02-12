"use client"

import { type ColumnDef, type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type SortingState, useReactTable, type VisibilityState } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Ticket } from "@/types/ticket"
import { useAuth } from "@/hooks/useAuth"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
interface DataTableProps {
    data: Ticket[]
}

// Helper function to get status color based on dashboard card colors
const getStatusColor = (status: string) => {
    switch (status) {
        case "RESOLVED":
            return "bg-emerald-400/30 hover:bg-emerald-400/40"
        case "FORWARDED_TO_MANAGER":
            return "bg-rose-300/30 hover:bg-rose-300/40"
        case "FORWARDED_TO_IT":
        case "FORWARDED_TO_HR":
            return "bg-yellow-300/30 hover:bg-yellow-300/40"
        case "REJECTED":
            return "bg-red-500/30 hover:bg-red-500/40"
        default:
            return "bg-secondary-background hover:bg-muted/50"
    }
}

export default function DataTable({ data }: DataTableProps) {
    const [filter, setFilter] = useState(false)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        [],
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const { userType: role } = useAuth()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    })
    const [timeFilter, setTimeFilter] = useState<"latest" | "last" | null>(
        null,
    )
    const [statusFilter, setStatusFilter] = useState<string | null>(null)



    const statusOptions = useMemo(() => {
        const formatStatus = (status: string) => status.replace(/_/g, " ")
        return Array.from(
            new Set(data.map((ticket) => formatStatus(ticket.status))),
        )
    }, [data])

    const columns = useMemo<ColumnDef<Ticket>[]>(() => {
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
            },
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
                            <ArrowUpDown />
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
                return <div className="text-right font-base hidden md:table-cell">{date.toLocaleDateString()}</div>
            },
        })

        return cols
    }, [role])

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
        onPaginationChange: setPagination,
        state: {
            pagination,
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    useEffect(() => {
        const createdAtSort =
            timeFilter === "latest"
                ? { id: "createdAt", desc: true }
                : timeFilter === "last"
                    ? { id: "createdAt", desc: false }
                    : null

        if (createdAtSort) {
            setSorting([createdAtSort])
        } else {
            setSorting((prev) => prev.filter((sort) => sort.id !== "createdAt"))
        }
    }, [timeFilter])

    useEffect(() => {
        const statusColumn = table.getColumn("status")
        if (!statusColumn) return

        if (statusFilter) {
            statusColumn.setFilterValue(statusFilter)
        } else {
            statusColumn.setFilterValue(undefined)
        }
    }, [statusFilter, table])

    return (
        <div className="w-full font-base text-main-foreground">
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center py-4 gap-2">
                <div className="flex items-center space-x-2">
                    <Switch id="filter" onCheckedChange={setFilter} />
                    <Label htmlFor="filter">Status</Label>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="noShadow" className="w-full sm:w-auto">
                            Filter <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                            Time
                        </div>
                        <DropdownMenuCheckboxItem
                            checked={timeFilter === "latest"}
                            onCheckedChange={(checked) =>
                                setTimeFilter(checked ? "latest" : null)
                            }
                        >
                            Latest created
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={timeFilter === "last"}
                            onCheckedChange={(checked) =>
                                setTimeFilter(checked ? "last" : null)
                            }
                        >
                            Last created
                        </DropdownMenuCheckboxItem>

                        <div className="mt-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                            Status
                        </div>
                        {statusOptions.map((status) => (
                            <DropdownMenuCheckboxItem
                                key={status}
                                className="capitalize"
                                checked={statusFilter === status}
                                onCheckedChange={(checked) =>
                                    setStatusFilter(checked ? status : null)
                                }
                            >
                                {status}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="border-2 rounded-xl overflow-hidden lg:min-w-4xl">
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="font-heading">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    className="bg-secondary-background text-foreground"
                                    key={headerGroup.id}
                                >
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead className="text-foreground whitespace-nowrap text-xs sm:text-sm" key={header.id}>
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
                                    const statusColor = getStatusColor(row.original.status)
                                    return (
                                        <TableRow
                                            className={`${filter ? statusColor : ''} text-foreground data-[state=selected]:bg-main data-[state=selected]:text-main-foreground transition-colors`}
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell className="px-2 sm:px-4 py-2 text-xs sm:text-sm" key={cell.id}>
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
                                        className="h-24 text-center text-xs sm:text-sm"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        className="cursor-pointer text-xs sm:text-sm"
                        variant="noShadow"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        className="cursor-pointer text-xs sm:text-sm"
                        variant="noShadow"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
