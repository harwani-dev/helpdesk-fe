import { useState, useEffect } from "react"
import { decodeJwt } from "@/lib/utils"
import type { DecodedToken } from "@/types/JWTToken"

export function useAuth() {
    const [userId, setUserId] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [userType, setUserType] = useState<"EMPLOYEE" | "MANAGER" | "HR" | "IT" | "ADMIN">()
    const [managerId, setManagerId] = useState<string | undefined>(undefined)
    const [image, setImage] = useState<string>("")
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        setToken(storedToken)

        if (storedToken) {
            const decoded = decodeJwt(storedToken) as DecodedToken
            if (decoded) {
                setUserId(decoded.userId)
                setUsername(decoded.username)
                setEmail(decoded.email)

                const rawUserType = decoded.userType
                if (!decoded.managerId && rawUserType === "EMPLOYEE") {
                    setUserType("MANAGER")
                } else {
                    setUserType(rawUserType)
                }

                setManagerId(decoded.managerId)
                setImage(decoded.image || "")
            }
        }
        setIsLoading(false)
    }, [])

    return {
        userId,
        username,
        email,
        userType,
        managerId,
        image,
        token,
        isLoading,
    }
}
