import type { ApiResponse } from "@/lib/api-schema"
import type { Ticket } from "@/types/ticket"
import api from "@/lib/api"

export const fetchTickets = async (userType: string) => {
    const isDepartmentUser = userType === "HR" || userType === "IT"
    const url = isDepartmentUser
        ? "/api/tickets/department"
        : "/api/tickets"

    const response = await api.get<ApiResponse<Ticket[]>>(url)
    return response.data
}