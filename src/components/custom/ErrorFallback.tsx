"use client"

interface ErrorFallbackProps {
    error: any
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
    return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Something went wrong!</h2>
                <p className="max-w-[500px] text-muted-foreground">
                    {error.message || "An unexpected error occurred. Please try again."}
                </p>
            </div>
        </div>
    )
}
