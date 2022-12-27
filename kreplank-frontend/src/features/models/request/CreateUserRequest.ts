import { BaseResponse } from "../BaseResponse"
import { User } from "../User"

export type CreateUserRequest = {
    nickname: string
    password: string,
    email: string,
}

export type CreateUserResponse = {
    user:User

} & BaseResponse