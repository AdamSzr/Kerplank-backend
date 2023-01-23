
export type JwtPayload = {
    sub: string
    iat: number
    exp: number
    roles: ['ADMIN', 'USER', 'MODERATOR', 'PARTNER']
    email: string
    details: {}
    permissions: any[]
}