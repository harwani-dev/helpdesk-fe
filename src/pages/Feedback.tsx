import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { DotBackground } from "@/components/ui/dotbg"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorFallback } from "@/components/custom/ErrorFallback"
import { Loader } from "./PageLoader"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Award, User } from "lucide-react"
import type { ApiResponse } from "@/lib/api-schema"
import { toast } from "sonner"

interface PerformanceData {
    person: {
        name: string | null
        id: string
        email: string
        username: string
    }
    department: string
    averageRating: number
    totalRatedTickets: number
}

function FeedbackContent() {
    const { userType } = useAuth()
    const navigate = useNavigate()
    const [selectedDepartment, setSelectedDepartment] = useState<"HR" | "IT">("HR")

    // Redirect non-admin users
    useEffect(() => {
        if (!!userType && userType !== "ADMIN") {
            navigate("/dashboard")
            toast.error("You are not authorized to access this page")
        }
    }, [userType, navigate])

    const { data, isPending, isError } = useQuery({
        queryKey: ["feedback", selectedDepartment],
        queryFn: async () => {
            const endpoint = selectedDepartment === "HR"
                ? "/api/feedback/hr"
                : "/api/feedback/it"
            const response = await api.get<ApiResponse<PerformanceData>>(endpoint)
            return response.data
        },
        enabled: userType === "ADMIN",
    })

    if (isPending || !userType) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
                <Loader />
            </div>
        )
    }

    if (isError) {
        return (
            <DotBackground>
                <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-foreground">Error loading feedback</h2>
                        <p className="text-muted-foreground">
                            Unable to fetch performance data. Please try again later.
                        </p>
                    </div>
                </div>
            </DotBackground>
        )
    }

    const performanceData = data?.data

    if (!performanceData) {
        return (
            <DotBackground>
                <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-foreground">No data available</h2>
                        <p className="text-muted-foreground">
                            No performance data found for this department.
                        </p>
                    </div>
                </div>
            </DotBackground>
        )
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                            }`}
                    />
                ))}
                <span className="ml-2 text-lg font-medium">{rating.toFixed(2)}</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <DotBackground>
                <div className="px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 bg-white dark:bg-black">
                    <div className="mt-10 sm:mt-20">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            Performance Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            View ratings and performance metrics for HR and IT departments
                        </p>
                    </div>

                    {/* Department Selector */}
                    <div className="mt-8 flex gap-4">
                        <Button
                            variant={selectedDepartment === "HR" ? "default" : "neutral"}
                            onClick={() => setSelectedDepartment("HR")}
                            className="font-semibold"
                        >
                            HR Department
                        </Button>
                        <Button
                            variant={selectedDepartment === "IT" ? "default" : "neutral"}
                            onClick={() => setSelectedDepartment("IT")}
                            className="font-semibold"
                        >
                            IT Department
                        </Button>
                    </div>

                    {/* Person Info Card */}
                    <div className="mt-8 border-2 border-border rounded-xl p-6 bg-secondary-background">
                        <div className="flex items-start gap-4">
                            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900">
                                <User className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-foreground">
                                    {performanceData.person.name || performanceData.person.username}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {performanceData.person.email}
                                </p>
                                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-main text-main-foreground border-2 border-border">
                                    {performanceData.department}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border-2 border-border rounded-xl p-6 bg-secondary-background">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                                    <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Average Rating</p>
                                    <div className="mt-2">
                                        {renderStars(performanceData.averageRating)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-border rounded-xl p-6 bg-secondary-background">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Rated Tickets</p>
                                    <p className="text-2xl font-bold mt-1">{performanceData.totalRatedTickets}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DotBackground>
        </div>
    )
}

export default function Feedback() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <FeedbackContent />
        </ErrorBoundary>
    )
}
