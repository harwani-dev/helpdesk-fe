import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { DotBackground } from "@/components/ui/dotbg"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { toast } from "sonner"
import { type ApiResponse } from "@/lib/api-schema"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorFallback } from "@/components/custom/ErrorFallback"
import { extractErrorMessage } from "@/lib/error-utils"

type LoginData = { token?: string }

export const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const loginMutation = useMutation({
        mutationFn: async (credentials: { username: string; password: string }) => {
            try {
                const response = await api.post<ApiResponse<LoginData>>(
                    `/api/auth/login`,
                    credentials
                )
                return response.data
            } catch (error) {
                // Re-throw to let onError handle it
                throw error
            }
        },
        onSuccess: (data) => {
            try {
                const token = data.data?.token
                if (token) {
                    localStorage.setItem("token", token)
                    toast.success("Login successful")
                    navigate("/dashboard")
                } else {
                    toast.error("No token received from server")
                }
            } catch (error) {
                console.error("Error in login success handler:", error)
                toast.error("An error occurred during login")
            }
        },
        onError: (error: any) => {
            console.error("Login error:", error)
            const errorMessage = extractErrorMessage(error, "Login failed. Please check your credentials.")
            toast.error(errorMessage)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        loginMutation.mutate({ username, password })
    }

    const handleReset = () => {
        // Reset form state when error boundary resets
        setUsername("")
        setPassword("")
        loginMutation.reset()
    }

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={handleReset}
        >
            <div className="grid grid-cols-10 h-screen">
                <div className="col-span-10 lg:col-span-4 flex items-center justify-center">
                    <DotBackground>
                        <div className="text-4xl text-center mb-4 font-base">
                            Helpdesk
                        </div>
                        <Card className="w-full lg:w-lg">
                            <CardHeader>
                                <CardTitle>Login to your account</CardTitle>
                                <CardDescription>
                                    Enter your username below to login to your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                placeholder="aubergine"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <CardFooter className="flex-col gap-2 px-0 pb-0 pt-6">
                                        <Button
                                            type="submit"
                                            className="w-full bg-main/50"
                                            disabled={loginMutation.isPending}
                                        >
                                            {loginMutation.isPending ? "Logging in…" : "Login"}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </CardContent>
                            <CardFooter className="flex-col gap-2 pt-0">
                                <div className="mt-4 text-center text-sm">
                                    <div>
                                        Don&apos;t have an account?{" "}
                                        <a href="/register" className="underline underline-offset-4">
                                            Sign up
                                        </a>
                                    </div>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm mt-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            </CardFooter>
                        </Card>
                    </DotBackground>
                </div>
                <div className="hidden lg:flex lg:col-span-6 rounded-l-2xl bg-main text-white items-center justify-center px-12">
                    <div className="max-w-md space-y-5">
                        <p className="text-xl font-bold tracking-[0.25em] uppercase text-white/70">
                            Helpdesk Platform
                        </p>
                        <h2 className="text-3xl font-semibold leading-tight">
                            Turn everyday requests into clear, trackable tickets.
                        </h2>
                        <p className="text-sm text-white/80">
                            Helpdesk gives your team a single place to capture, prioritize, and resolve
                            internal requests — from IT issues to product feedback — with full
                            visibility across the lifecycle.
                        </p>
                        <ul className="space-y-3 text-sm text-white/90">
                            <li className="flex gap-3">
                                <span className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 text-xs">
                                    1
                                </span>
                                <span>Centralize tickets from email, chat, and forms into one board.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 text-xs">
                                    2
                                </span>
                                <span>See real-time activity so nothing slips through the cracks.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 text-xs">
                                    3
                                </span>
                                <span>Collaborate with your team using comments, status, and ownership.</span>
                            </li>
                        </ul>
                        <p className="text-xs text-white/60 border-t border-white/10 pt-4">
                            Designed for fast-moving teams who care about clear, transparent support.
                        </p>
                    </div>
                </div>
            </div>
        </ErrorBoundary >
    )
}

