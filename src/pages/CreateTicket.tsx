import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import api from "@/lib/api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DotBackground } from "@/components/ui/dotbg"
import { createTicketSchema } from "@/lib/schemas"
import { TicketType, ticketTypes, hrTypes, itTypes } from "@/lib/constants"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorFallback } from "@/components/custom/ErrorFallback"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { extractErrorMessage } from "@/lib/error-utils"

type CreateTicketFormValues = {
    title: string
    description: string
    ticketType: string
    hrType?: string
    itType?: string
}

function CreateTicketComponent() {
    const { userType } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const form = useForm<CreateTicketFormValues>({
        resolver: joiResolver(createTicketSchema),
        defaultValues: {
            title: "",
            description: "",
            ticketType: "",
        },
    })

    const ticketType = form.watch("ticketType")

    const createTicketMutation = useMutation({
        mutationFn: async (values: CreateTicketFormValues) => {
            const response = await api.post("/api/tickets", values)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] })
            queryClient.invalidateQueries({ queryKey: ["action-tickets"] })
            toast.success("Ticket created successfully")
            navigate("/dashboard")
        },
        onError: (error: any) => {
            console.error(error)
            const errorMessage = extractErrorMessage(error, "Failed to create ticket")
            toast.error(errorMessage)
        },
    })

    function onSubmit(values: CreateTicketFormValues) {
        createTicketMutation.mutate(values)
    }

    useEffect(() => {
        if (userType !== undefined && userType !== "EMPLOYEE" && userType !== "MANAGER") {
            navigate("/dashboard")
            toast.error("This page is not available for your role")
        }
    }, [userType])

    return (
        <DotBackground>
            <div className="flex w-full lg:min-w-2xl min-h-screen items-center justify-center p-4 sm:p-6">
                <Card className="w-full max-w-xl md:max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl">Create New Ticket</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 sm:space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Short summary of the issue" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    className="min-h-[120px] w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground placeholder:text-foreground/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                                    placeholder="Describe the issue in detail"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ticketType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ticket Type</FormLabel>
                                            <FormControl>
                                                <select
                                                    className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                >
                                                    <option value="">Select a ticket type</option>
                                                    {ticketTypes.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {ticketType === TicketType.HR && (
                                    <FormField
                                        control={form.control}
                                        name="hrType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>HR Type</FormLabel>
                                                <FormControl>
                                                    <select
                                                        className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    >
                                                        <option value="">Select HR type</option>
                                                        {hrTypes.map((type) => (
                                                            <option key={type} value={type}>
                                                                {type}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {ticketType === TicketType.IT && (
                                    <FormField
                                        control={form.control}
                                        name="itType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>IT Type</FormLabel>
                                                <FormControl>
                                                    <select
                                                        className="flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    >
                                                        <option value="">Select IT type</option>
                                                        {itTypes.map((type) => (
                                                            <option key={type} value={type}>
                                                                {type}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={createTicketMutation.isPending} className="w-full sm:w-auto">
                                        {createTicketMutation.isPending ? "Submitting..." : "Submit Ticket"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </DotBackground>
    )
}


export default function CreateTicket() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <CreateTicketComponent />
        </ErrorBoundary>
    )
}