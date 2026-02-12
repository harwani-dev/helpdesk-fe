"use client";

import { useMemo } from "react";
import type { Ticket } from "@/types/ticket";

interface TicketCardProps {
    tickets: Ticket[];
}

export function TicketCard({ tickets = [] }: TicketCardProps) {
    const statsCards = useMemo(() => [
        {
            key: "total",
            title: "Total Tickets",
            description: "All tickets created in the helpdesk",
            value: tickets.length,
            bgClass: "bg-sky-400",
        },
        {
            key: "solved",
            title: "Total Solved",
            description: "Tickets that have been resolved",
            value: tickets.filter((t) => t.status === "RESOLVED").length,
            bgClass: "bg-emerald-400",
        },
        {
            key: "awaiting_approval",
            title: "Total Awaiting Approval",
            description: "Tickets pending manager approval",
            value: tickets.filter((t) => t.status === "FORWARDED_TO_MANAGER").length,
            bgClass: "bg-rose-300",
        },
        {
            key: "in_progress",
            title: "Total In Progress",
            description: "Tickets currently being worked on",
            value: tickets.filter((t) => t.status === "FORWARDED_TO_IT" || t.status === "FORWARDED_TO_HR")
                .length,
            bgClass: "bg-yellow-300",
        },
    ], [tickets]);

    return (
        <ul className="max-w-5xl mx-auto lg:min-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 items-start gap-4 sm:gap-6 lg:gap-8 py-6 sm:py-10">
            {statsCards.map((card) => (
                <li key={card.key}>
                    <div
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border-2 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] gap-4 sm:gap-0 ${card.bgClass}`}
                    >
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-bold text-black">
                                {card.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-black">
                                {card.description}
                            </p>
                        </div>
                        <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black text-left sm:text-right">
                            {card.value}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}