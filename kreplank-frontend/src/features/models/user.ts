export type User = {
    nickname: string
    password: string,
    role: "ADMIN" | "USER",
    email: string,
}