import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { DotBackground } from "@/components/ui/dotbg"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { toast } from "sonner"
import { type ApiResponse } from "@/lib/api-schema"

type RegisterData = { token?: string }

export const Register = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const registerMutation = useMutation({
        mutationFn: async (payload: { username: string; email: string; password: string }) => {
            const response = await api.post<ApiResponse<RegisterData>>(`/api/auth/register`, payload)
            return response.data
        },
        onSuccess: (data) => {
            const token = data.data?.token
            if (token) localStorage.setItem("token", token)
            toast.success("Registration successful")
            navigate("/dashboard")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Registration failed")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        registerMutation.mutate({ username, email, password })
    }

    return (
        <div className="grid grid-cols-10 h-screen">
            <div className="col-span-10 lg:col-span-4 flex items-center justify-center">
                <DotBackground>
                    <div className="text-4xl text-center mb-4 font-base">
                        Helpdesk
                    </div>
                    <Card className="w-full lg:w-lg">
                        <CardHeader>
                            <CardTitle>Register a new account</CardTitle>
                            <CardDescription>
                                Enter details below to create a new account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            placeholder="johndoe"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            placeholder="johndoe@aubergine.co"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            type="email"
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
                                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                                        {registerMutation.isPending ? "Signing up…" : "Sign up"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 pt-0">
                            <div className="mt-4 text-center text-sm">
                                <div>
                                    Don&apos;t have an account?{" "}
                                    <a href="/login" className="underline underline-offset-4">
                                        Login
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
                        Why teams use Helpdesk
                    </p>
                    <h2 className="text-3xl font-semibold leading-tight">
                        Give every request a clear home from day one.
                    </h2>
                    <p className="text-sm text-white/80">
                        When you register, you unlock a shared workspace where support, product, and
                        operations can see exactly what&apos;s happening — and what needs attention
                        next.
                    </p>
                    <ul className="space-y-3 text-sm text-white/90">
                        <li className="flex gap-3">
                            <span className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 text-xs">
                                ✔
                            </span>
                            <span>Ticket queues that match how your team actually works.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 text-xs">
                                ✔
                            </span>
                            <span>Activity timelines so you always know the latest update.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 text-xs">
                                ✔
                            </span>
                            <span>Simple, focused UI built for fast responses.</span>
                        </li>
                    </ul>
                    <p className="text-xs text-white/60 border-t border-white/10 pt-4">
                        Start now and keep every request visible, owned, and moving forward.
                    </p>
                </div>
            </div>
        </div>
    )
}

