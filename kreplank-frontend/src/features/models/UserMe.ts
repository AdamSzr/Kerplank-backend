export type UserMe = {
    nickname: string
    password: string,
    role: "ADMIN" | "USER",
    email: string,
}