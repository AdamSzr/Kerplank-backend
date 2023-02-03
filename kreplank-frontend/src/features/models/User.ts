export type User = {
    "nickname": string,
    "role": "ADMIN" | "USER" | "MODERATOR" | "PARTNER",
    "email": string,
    "details": object,
    "permissions": string[],
    "created": string,
    "activated": boolean
}