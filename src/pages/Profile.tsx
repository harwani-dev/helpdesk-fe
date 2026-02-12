import { DotBackground } from "@/components/ui/dotbg"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useRef, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { toast } from "sonner"
import { Camera, User } from "lucide-react"
import { useAuthHeader } from "@/hooks/useAuthHeader"
import type { UserProfile } from "@/types/profile"
import { extractErrorMessage } from "@/lib/error-utils"

export default function Profile() {
    const [name, setName] = useState("")
    const [contactNo, setContactNo] = useState("")
    const [email, setEmail] = useState("")
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const authHeader = useAuthHeader()
    const queryClient = useQueryClient()

    // Fetch current user profile
    const { data: userProfile, isLoading: userLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async (): Promise<UserProfile> => {
            const { data } = await api.get(`/api/users/me`)
            const user = data.data ?? data
            return {
                id: user.id,
                username: user.name ?? "",
                email: user.email ?? "",
                phone: user.phone,
                image: user.profileImage,
                managerId: user.managerId,
                manager: user.manager ? {
                    id: user.managerId,
                    username: user.manager.username ?? user.manager.name ?? "",
                    email: user.manager.email ?? "",
                    image: undefined,
                } : undefined,
            }
        },
        enabled: !!authHeader,
    })

    // Set state when user profile loads
    useEffect(() => {
        if (userProfile) {
            setName(userProfile.username)
            setEmail(userProfile.email)
            setContactNo(userProfile.phone ?? "")
            setProfileImage(userProfile.image ?? null)
        }
    }, [userProfile])

    const manager = userProfile?.manager



    // Mutation for updating profile
    const updateProfileMutation = useMutation({
        mutationFn: async (data: { phone?: string; profileImage?: string }) => {
            const response = await api.post(`/api/users/profile`, data)
            return response.data
        },
        onSuccess: () => {
            toast.success("Profile updated successfully")
            queryClient.invalidateQueries({ queryKey: ["userProfile"] })
        },
        onError: (error: unknown) => {
            const message = extractErrorMessage(error as any, "Failed to update profile")
            toast.error(message)
        },
    })

    const handleSaveChanges = () => {
        // Only send fields that have changed
        const updates: { phone?: string } = {}

        if (contactNo !== (userProfile?.phone ?? "")) {
            updates.phone = contactNo
        }

        // Check if there are any changes to save
        if (Object.keys(updates).length === 0) {
            toast.info("No changes to save")
            return
        }

        updateProfileMutation.mutate(updates)
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file (e.g. JPEG, PNG)")
            return
        }
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            setProfileImage(result)
        }
        reader.readAsDataURL(file)
    }

    const handleUploadProfilePicture = () => {
        if (!profileImage) {
            toast.error("Select an image first")
            return
        }

        // Only send the profile image, not other fields
        updateProfileMutation.mutate({ profileImage })
    }

    const avatarUrl = profileImage ?? undefined
    const fallbackInitials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "?"

    if (userLoading) {
        return (
            <DotBackground>
                <div className="w-full max-w-6xl mx-auto px-6 py-10">
                    <p className="text-center text-muted-foreground">Loading profile…</p>
                </div>
            </DotBackground>
        )
    }

    return (
        <DotBackground>
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6 sm:gap-10">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-stretch">
                    {/* User profile card - larger */}
                    <Card className="flex-1 min-w-0 py-6 sm:py-8 px-4 sm:px-8 shadow-lg">
                        <CardHeader className="pb-4 sm:pb-6 px-0">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                <div className="relative group">
                                    <Avatar className="size-20 sm:size-28 shrink-0 border-2 border-border shadow-shadow">
                                        <AvatarImage src={avatarUrl} alt={name} />
                                        <AvatarFallback className="text-xl sm:text-2xl">
                                            {fallbackInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Change photo"
                                    >
                                        <Camera className="size-6 sm:size-8 text-white" />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <CardTitle className="text-xl sm:text-2xl">{name || "—"}</CardTitle>
                                    <p className="text-sm sm:text-base text-muted-foreground break-all">{email || "—"}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 px-0">
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                                <Button
                                    variant="neutral"
                                    size="lg"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full sm:w-auto"
                                >
                                    Choose image
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={handleUploadProfilePicture}
                                    disabled={!profileImage || updateProfileMutation.isPending}
                                    className="w-full sm:w-auto"
                                >
                                    {updateProfileMutation.isPending ? "Uploading…" : "Update profile picture"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change info form - larger */}
                    <Card className="flex-1 min-w-0 py-6 sm:py-8 px-4 sm:px-8 shadow-lg">
                        <CardHeader className="pb-4 px-0">
                            <CardTitle className="text-xl sm:text-2xl">Change info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-5 px-0">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm sm:text-base">Username</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    disabled
                                    className="h-10 sm:h-11 text-sm sm:text-base opacity-70"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contact" className="text-sm sm:text-base">Contact No</Label>
                                <Input
                                    id="contact"
                                    value={contactNo}
                                    onChange={(e) => setContactNo(e.target.value)}
                                    className="h-10 sm:h-11 text-sm sm:text-base"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    disabled
                                    className="h-10 sm:h-11 text-sm sm:text-base opacity-70"
                                />
                            </div>
                            <Button
                                type="button"
                                size="lg"
                                className="h-10 sm:h-11 text-sm sm:text-base w-full"
                                onClick={handleSaveChanges}
                                disabled={updateProfileMutation.isPending}
                            >
                                {updateProfileMutation.isPending ? "Saving…" : "Save changes"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Manager profile card - only when manager present */}
                {manager && (
                    <Card className="py-6 sm:py-8 px-4 sm:px-8 shadow-lg">
                        <CardHeader className="pb-4 px-0">
                            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                <User className="size-4 sm:size-5" />
                                Manager
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                <Avatar className="size-16 sm:size-20 shrink-0 border-2 border-border shadow-shadow">
                                    <AvatarImage src={manager.image} alt={manager.username} />
                                    <AvatarFallback className="text-lg sm:text-xl">
                                        {manager.username
                                            ? manager.username
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()
                                                .slice(0, 2)
                                            : "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 text-sm sm:text-base text-center sm:text-left">
                                    <p className="font-medium">{manager.username || "—"}</p>
                                    <p className="text-muted-foreground break-all">{manager.email || "—"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DotBackground>
    )
}