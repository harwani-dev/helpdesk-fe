import TicketsDataTable from "@/components/custom/TicketsDataTable"
import ActionTicketsDataTable from "@/components/custom/ActionTicketsDataTable"
import type { Ticket } from "@/types/ticket"
import { DotBackground } from "@/components/ui/dotbg"
import { type ApiResponse } from "@/lib/api-schema"
import { useQuery } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorFallback } from "@/components/custom/ErrorFallback"
import { Loader } from "./PageLoader"
import { Ticket as TicketIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useAuthHeader } from "@/hooks/useAuthHeader"
import api from "@/lib/api"
import { fetchTickets } from "@/prefetch/tickets"

function TicketsContent() {
    const { userType } = useAuth()
    const authHeader = useAuthHeader()
    const query = useQuery({
        queryKey: ["tickets"],
        queryFn: () => fetchTickets(userType!),
        throwOnError: true,
        enabled: !!authHeader,
    })

    const actionTicketsQuery = useQuery({
        queryKey: ["action-tickets"],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Ticket[]>>("/api/tickets/action")
            return response.data
        },
        throwOnError: false,
        retry: true,
        enabled: userType !== "EMPLOYEE" && !!authHeader,
    })

    const tickets = query.data?.data || []
    const actionTickets = actionTicketsQuery.data?.data || []
    const hasActionTickets = actionTicketsQuery.isSuccess && actionTickets.length > 0

    if (query.isLoading || actionTicketsQuery.isLoading) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
                <Loader />
            </div>
        )
    }

    if (!query.isPending && tickets.length === 0 && !hasActionTickets) {
        return (
            <DotBackground>
                <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-background">
                        <TicketIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-foreground">No tickets found</h2>
                        <p className="text-muted-foreground">
                            You haven't created any tickets yet.
                        </p>
                    </div>
                </div>
            </DotBackground>
        )
    }

    return (
        <div>
            <DotBackground>
                <div className="container mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
                    {hasActionTickets && (
                        <div className="mb-10">
                            <h1 className="text-2xl sm:text-3xl font-bold mt-10 sm:mt-20 mb-6 text-foreground">
                                Action Required
                            </h1>
                            <ActionTicketsDataTable
                                data={actionTickets}
                                onRefetch={() => actionTicketsQuery.refetch()}
                            />
                        </div>
                    )}
                    {/* see my tickets (for employee) and department tickets (for hr and it)*/}
                    <h1 className="text-2xl sm:text-3xl mt-10 sm:mt-20 mx-auto font-bold text-foreground">
                        {(userType === "EMPLOYEE" || userType === "MANAGER")
                            ? "My Tickets"
                            : userType === "ADMIN"
                                ? "All Tickets"
                                : "Department Tickets"}
                    </h1>
                    <TicketsDataTable data={tickets} />

                </div>
            </DotBackground>
        </div>
    )
}

export default function TicketsPage() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <TicketsContent />
        </ErrorBoundary>
    )
}
