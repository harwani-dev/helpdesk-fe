"use client";

export function ExpandableTicket() {
    return (
        <ul className="max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 items-start gap-8 py-10">
            {statsCards.map((card) => (
                <li key={card.key}>
                    <div
                        className={`flex items-center justify-between rounded-xl border-2 px-8 py-8 min-h-[160px] sm:min-h-[180px] ${card.bgClass}`}
                    >
                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-bold text-black">
                                {card.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-black">
                                {card.description}
                            </p>
                        </div>
                        <p className="text-5xl sm:text-6xl font-extrabold text-black text-right">
                            {card.value}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

type TicketStatus = "new" | "in_progress" | "awaiting_approval" | "solved";

type StatKey = "total" | "solved" | "awaiting_approval" | "in_progress";

type Ticket = {
    id: string;
    title: string;
    requester: string;
    status: TicketStatus;
    priority: "Low" | "Medium" | "High";
    createdAt: string;
    assignedTo: string;
};

const tickets: Ticket[] = [
    {
        id: "HD-1021",
        title: "Cannot connect to VPN",
        requester: "Bhavya M",
        status: "in_progress",
        priority: "High",
        createdAt: "05 Feb 2026, 09:14 AM",
        assignedTo: "IT Support L1",
    },
    {
        id: "HD-0987",
        title: "New monitor request",
        requester: "Internship Team",
        status: "solved",
        priority: "Medium",
        createdAt: "03 Feb 2026, 10:02 AM",
        assignedTo: "Admin",
    },
    {
        id: "HD-1104",
        title: "Access request for HR portal",
        requester: "HR Team",
        status: "awaiting_approval",
        priority: "Low",
        createdAt: "04 Feb 2026, 11:05 AM",
        assignedTo: "HR Manager",
    },
    {
        id: "HD-1003",
        title: "Laptop running very slow",
        requester: "Finance Team",
        status: "in_progress",
        priority: "High",
        createdAt: "02 Feb 2026, 03:47 PM",
        assignedTo: "IT Support L2",
    },
    {
        id: "HD-1014",
        title: "Outlook not syncing emails",
        requester: "Sales Team",
        status: "solved",
        priority: "Medium",
        createdAt: "01 Feb 2026, 01:22 PM",
        assignedTo: "IT Support L1",
    },
    {
        id: "HD-1030",
        title: "Printer not available on network",
        requester: "Operations",
        status: "new",
        priority: "Medium",
        createdAt: "05 Feb 2026, 08:45 AM",
        assignedTo: "IT Support L1",
    },
    {
        id: "HD-0999",
        title: "Password reset request",
        requester: "New Joiner",
        status: "solved",
        priority: "Low",
        createdAt: "30 Jan 2026, 09:05 AM",
        assignedTo: "Service Desk",
    },
    {
        id: "HD-1042",
        title: "Software installation request - VS Code",
        requester: "Developer",
        status: "awaiting_approval",
        priority: "Low",
        createdAt: "05 Feb 2026, 10:30 AM",
        assignedTo: "Tech Lead",
    },
    {
        id: "HD-1077",
        title: "Wi-Fi dropping frequently",
        requester: "Marketing",
        status: "in_progress",
        priority: "High",
        createdAt: "04 Feb 2026, 05:10 PM",
        assignedTo: "Network Team",
    },
    {
        id: "HD-0965",
        title: "Access to shared drive",
        requester: "Design Team",
        status: "solved",
        priority: "Medium",
        createdAt: "28 Jan 2026, 02:55 PM",
        assignedTo: "IT Support L1",
    },
    {
        id: "HD-0923",
        title: "System auto-restarting",
        requester: "QA Team",
        status: "solved",
        priority: "High",
        createdAt: "25 Jan 2026, 11:40 AM",
        assignedTo: "IT Support L2",
    },
    {
        id: "HD-0950",
        title: "Request for JIRA access",
        requester: "Product Owner",
        status: "solved",
        priority: "Low",
        createdAt: "27 Jan 2026, 04:05 PM",
        assignedTo: "Admin",
    },
];

const statsCards = [
    {
        key: "total" as StatKey,
        title: "Total Tickets",
        description: "All tickets created in the helpdesk",
        value: tickets.length,
        bgClass: "bg-sky-400",
        titleTextClass: "text-black",
        subTextClass: "text-sky-100",
        valueTextClass: "text-black",
        accentClass: "bg-sky-500",
    },
    {
        key: "solved" as StatKey,
        title: "Total Solved",
        description: "Tickets that have been resolved",
        value: tickets.filter((t) => t.status === "solved").length,
        bgClass: "bg-emerald-400",
        titleTextClass: "text-white",
        subTextClass: "text-emerald-100",
        valueTextClass: "text-white",
        accentClass: "bg-emerald-500",
    },
    {
        key: "awaiting_approval" as StatKey,
        title: "Total Awaiting Approval",
        description: "Tickets pending manager approval",
        value: tickets.filter((t) => t.status === "awaiting_approval").length,
        bgClass: "bg-rose-300",
        titleTextClass: "text-slate-900",
        subTextClass: "text-rose-100",
        valueTextClass: "text-slate-900",
        accentClass: "bg-rose-400",
    },
    {
        key: "in_progress" as StatKey,
        title: "Total In Progress",
        description: "Tickets currently being worked on",
        value: tickets.filter((t) => t.status === "in_progress" || t.status === "new")
            .length,
        bgClass: "bg-yellow-300",
        titleTextClass: "text-slate-900",
        subTextClass: "text-yellow-900/70",
        valueTextClass: "text-slate-900",
        accentClass: "bg-yellow-400",
    },
] as const;