import { useState, useEffect, use } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Ticket } from "@/types/ticket"
import api from "@/lib/api"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"

interface ModalProps {
    ticket: Ticket | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export default function Modal({
    ticket,
    open,
    onOpenChange,
}: ModalProps) {
    const [remarks, setRemarks] = useState("")
    const [rating, setRating] = useState<number | null>(null)
    const { userType, userId } = useAuth()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (ticket) {
            setRemarks(ticket.remarks || "")
            setRating(null)
        }
    }, [ticket])

    const { mutate: mutateTicketAction, isPending: isSubmitting } = useMutation({
        mutationFn: async (variables: {
            action: "resolved" | "rejected" | "approve" | "close" | "reopen"
            remarks: string
            rating?: number
        }) => {
            return api.post(
                `/api/tickets/action/${ticket?.id}`,
                {
                    action: variables.action,
                    remarks: variables.remarks.trim(),
                    ...(variables.rating && { rating: variables.rating }),
                }
            )
        },
        onSuccess: (_data, variables) => {
            // Invalidate all ticket-related queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["tickets"] })
            queryClient.invalidateQueries({ queryKey: ["action-tickets"] })
            toast.success(
                `Ticket ${variables.action === "approve" ? "approved" : variables.action
                } successfully`
            )
            onOpenChange(false)
        },
        onError: (error: any, variables) => {
            console.error(error)
            const errorMessage = error.response?.data?.error || `Failed to ${variables.action} ticket`
            toast.error(errorMessage)
        },
    })

    const handleAction = (action: "resolved" | "rejected" | "approve" | "close" | "reopen") => {
        if (!ticket) return

        // Validate remarks are compulsory
        if (!remarks.trim()) {
            toast.error("Remarks are compulsory for all actions")
            return
        }

        // Validate rating is compulsory when closing a resolved ticket
        if (action === "close" && ticket.status === "RESOLVED" && !rating) {
            toast.error("Rating is compulsory when closing a resolved ticket")
            return
        }

        mutateTicketAction({
            action,
            remarks,
            rating: rating || undefined,
        })
    }

    if (!ticket) return null


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">{ticket.title}</DialogTitle>
                    <DialogDescription className="text-sm">Ticket ID: {ticket.id}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4">
                    <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-medium leading-none">Status</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                            {ticket.status?.replace(/_/g, " ") || "N/A"}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-medium leading-none">Description</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground wrap-break-word">{ticket.description || "No description"}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-medium leading-none">Created By</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground break-all">
                            {ticket.createdBy?.email || "Unknown"}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-medium leading-none">Type</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                            {ticket.ticketType || "N/A"} -{" "}
                            {ticket.ticketType === "IT" ? (ticket.itType || "N/A") : (ticket.hrType || "N/A")}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-medium leading-none">Remarks</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground wrap-break-word">{ticket.remarks || "No remarks"}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-medium leading-none">Created At</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}
                        </p>
                    </div>
                    {ticket.updatedAt && (
                        <div className="space-y-1">
                            <h4 className="text-xs sm:text-sm font-medium leading-none">Last Updated</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                {new Date(ticket.updatedAt).toLocaleString()}
                            </p>
                        </div>
                    )}
                    <div className="col-span-1 sm:col-span-2 space-y-2">
                        <h4 className="text-xs sm:text-sm font-medium leading-none">
                            Add Remarks <span className="text-red-500">*</span>
                        </h4>
                        <textarea
                            className="min-h-[80px] sm:min-h-[100px] w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-xs sm:text-sm font-base text-foreground placeholder:text-foreground/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                            placeholder="Add remarks (compulsory)"
                            onChange={(e) => setRemarks(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    {ticket.status === "RESOLVED" && (userType === "EMPLOYEE" || userType === "MANAGER") && (
                        <div className="col-span-1 sm:col-span-2 space-y-2">
                            <h4 className="text-xs sm:text-sm font-medium leading-none">
                                Rate this ticket <span className="text-red-500">*</span>
                            </h4>
                            <div className="flex gap-2 items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        disabled={isSubmitting}
                                        className="text-2xl sm:text-3xl transition-colors disabled:opacity-50"
                                    >
                                        {rating && star <= rating ? (
                                            <span className="text-yellow-500">★</span>
                                        ) : (
                                            <span className="text-gray-300">☆</span>
                                        )}
                                    </button>
                                ))}
                                {rating && (
                                    <span className="text-xs sm:text-sm text-muted-foreground ml-2">
                                        {rating} / 5
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter className="gap-2 flex-col sm:flex-row">
                    {(userType === "HR" || userType === "IT") && (
                        <>
                            <Button
                                variant="default"
                                onClick={() => handleAction("rejected")}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => handleAction("resolved")}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Resolve
                            </Button>
                        </>
                    )}

                    {(userType === "MANAGER" && ticket.createdBy.id === userId) && (
                        <>
                            <Button
                                variant="default"
                                onClick={() => handleAction("close")}
                                disabled={isSubmitting || ticket.status === "CLOSED"}
                                className="w-full sm:w-auto"
                            >
                                Close Ticket
                            </Button>
                            <Button
                                onClick={() => handleAction("reopen")}
                                disabled={isSubmitting || ticket.status !== "REJECTED"}
                                className="w-full sm:w-auto"
                            >
                                Reopen
                            </Button>
                        </>
                    )}
                    {(userType === "MANAGER" && ticket.createdBy.id !== userId) && (
                        <>
                            <Button
                                variant="default"
                                onClick={() => handleAction("rejected")}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => handleAction("approve")}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Approve
                            </Button>
                        </>
                    )}

                    {userType === "EMPLOYEE" && (
                        <>
                            <Button
                                variant="default"
                                onClick={() => handleAction("close")}
                                disabled={isSubmitting || ticket.status === "CLOSED"}
                                className="w-full sm:w-auto"
                            >
                                Close Ticket
                            </Button>
                            <Button
                                onClick={() => handleAction("reopen")}
                                disabled={isSubmitting || ticket.status !== "REJECTED"}
                                className="w-full sm:w-auto"
                            >
                                Reopen
                            </Button>
                        </>
                    )}

                    {userType === "ADMIN" && (
                        <>
                            {/* Manager stage: awaiting approval */}
                            {(ticket.status === "FORWARDED_TO_MANAGER") && (
                                <>
                                    <Button
                                        variant="default"
                                        onClick={() => handleAction("rejected")}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto"
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleAction("approve")}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto"
                                    >
                                        Approve
                                    </Button>
                                </>
                            )}
                            {(ticket.status === "FORWARDED_TO_HR" || ticket.status === "FORWARDED_TO_IT") && (
                                <>
                                    <Button
                                        variant="default"
                                        onClick={() => handleAction("rejected")}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto"
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleAction("resolved")}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto"
                                    >
                                        Resolve
                                    </Button>
                                </>
                            )}
                            {/* Resolved: employee can close */}
                            {ticket.status === "RESOLVED" && (
                                <Button
                                    variant="default"
                                    onClick={() => handleAction("close")}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto"
                                >
                                    Close Ticket
                                </Button>
                            )}
                            {/* Rejected: employee can reopen */}
                            {ticket.status === "REJECTED" && (
                                <Button
                                    onClick={() => handleAction("reopen")}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto"
                                >
                                    Reopen
                                </Button>
                            )}
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
