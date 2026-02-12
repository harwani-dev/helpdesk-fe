import { useAuth } from "./useAuth"

/**
 * Hook that returns the Authorization header value with Bearer token
 * @returns Bearer token string for Authorization header, or empty string if no token
 */
export function useAuthHeader(): string {
    const { token } = useAuth()
    return token ? `Bearer ${token}` : ""
}
