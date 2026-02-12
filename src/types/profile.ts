export type ManagerProfile = {
    id: number
    username: string
    email: string
    image?: string
}

export type UserProfile = {
    id: number
    username: string
    email: string
    phone?: string
    image?: string
    managerId?: number
    manager?: ManagerProfile
}
