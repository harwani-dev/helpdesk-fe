"use client"

import { Button } from "@/components/ui/button"

interface ErrorFallbackProps {
    error: any
    resetErrorBoundary?: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
    return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Something went wrong!</h2>
                <p className="max-w-[500px] text-muted-foreground">
                    {error?.message || "An unexpected error occurred. Please try again."}
                </p>
                {resetErrorBoundary && (
                    <Button
                        onClick={resetErrorBoundary}
                        variant="neutral"
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    )
}
