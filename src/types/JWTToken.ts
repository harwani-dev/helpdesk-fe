export interface DecodedToken {
    userId: string
    username: string
    email: string
    userType: "ADMIN" | "MANAGER" | "EMPLOYEE" | "IT" | "HR"
    managerId?: string
    image?: string
}