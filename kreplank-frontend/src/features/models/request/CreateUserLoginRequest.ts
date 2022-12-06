export type CreateUserRequest = {
    nickname: string
    password: string,
    role: "ADMIN" | "USER",
    email: string,
}