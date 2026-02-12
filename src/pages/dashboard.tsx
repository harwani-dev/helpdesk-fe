import DataTable from "@/components/custom/Table"
import { TicketCard } from "@/components/custom/TicketCard"
import type { Ticket } from "@/types/ticket"
import { DotBackground } from "@/components/ui/dotbg"
import { type ApiResponse } from "@/lib/api-schema"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorFallback } from "@/components/custom/ErrorFallback"
import { Ticket as TicketIcon } from "lucide-react"
import { Loader } from "./PageLoader"
import { useAuth } from "@/hooks/useAuth"
import { useAuthHeader } from "@/hooks/useAuthHeader"
import api from "@/lib/api"
import { useEffect } from "react"
import { fetchTickets } from "@/prefetch/tickets"

function DashboardContent() {
    const { userType } = useAuth()
    const authHeader = useAuthHeader()
    const queryClient = useQueryClient()


    const query = useQuery({
        queryKey: [userType],
        enabled: !!userType,
        queryFn: async () => {
            const isActionUser =
                userType === "HR" || userType === "IT" || userType === "MANAGER"

            const endpoint = isActionUser
                ? "/api/tickets/action"
                : "/api/tickets"

            const response = await api.get<ApiResponse<Ticket[]>>(endpoint)

            return response.data
        },
        throwOnError: true,
    })

    useEffect(() => {
        if (authHeader) {
            queryClient.prefetchQuery({
                queryKey: ["tickets"],
                queryFn: () => fetchTickets(userType!)
            })
        }
    }, [userType, authHeader])

    const tickets = query.data?.data || []

    if (query.isPending || !userType) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
                <Loader />
            </div>
        )
    }

    if (!query.isPending && tickets.length === 0) {
        return (
            <DotBackground>
                <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-background">
                        <TicketIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-foreground">No tickets found</h2>
                        <p className="text-muted-foreground">
                            There are currently no tickets in the system.
                        </p>
                    </div>
                </div>
            </DotBackground>
        )
    }

    return (
        <div className="min-h-screen">
            <DotBackground>
                <div className="px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 bg-white dark:bg-black">
                    <h1 className="text-2xl sm:text-3xl font-bold mt-10 sm:mt-20 text-foreground">Dashboard {userType === "MANAGER" && "(Action Required)"}</h1>
                    <TicketCard tickets={tickets} />
                    <DataTable data={tickets} />
                </div>
            </DotBackground>
        </div>
    )
}

export default function Dashboard() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <DashboardContent />
        </ErrorBoundary>
    )
}
