import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-muted">
            <div className="text-center">
                <p className="text-sm font-semibold text-muted-foreground">404</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    Page not found
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>
            </div>
            <div className="flex gap-3">
                <Button variant="neutral" onClick={() => navigate(-1)}>
                    Go back
                </Button>
                <Button onClick={() => navigate("/")}>
                    Go to home
                </Button>
            </div>
        </div>
    )
}

