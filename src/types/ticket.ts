export type TicketStatus = "FORWARDED_TO_HR" | "FORWARDED_TO_IT" | "FORWARDED_TO_MANAGER" | "RESOLVED" | "CLOSED" | "APPROVED" | "REJECTED";
export type TicketType = "IT" | "HR";
export type HrType = "payroll" | "leaves" | "hiring" | "other";
export type ItType = "hardware" | "software" | "network" | "other";

export interface Ticket {
    id: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    remarks: string | null;
    title: string;
    description: string;
    status: TicketStatus;
    ticketType: TicketType;
    hrType: HrType | null;
    itType: ItType | null;
    requiresApproval: boolean;
    createdById: string;
    createdBy: {
        id: string;
        email: string;
        name: string | null;
    };
    rating?: number | null;
}