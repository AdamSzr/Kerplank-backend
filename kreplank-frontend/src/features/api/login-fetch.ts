import { Endpoints } from "../config"
import { BaseResponse } from "../models/base-response"
import { customFetch } from "./custom-fetch"


export type LoginCredentials = {
    email?: string,
    password: string,
    nickname?: string,
    type: "EMAIL" | "NICKNAME"
}


export type LoginResponse = {
    token: string
} & BaseResponse


export function login(loginData: LoginCredentials) {
    if (!loginData.email && loginData.type == 'EMAIL')
        throw Error("cant login via email cause email is not provided")
    if (!loginData.nickname && loginData.type == 'NICKNAME')
        throw Error("cant login via nickname cause nickname is not provided")

    return customFetch<LoginResponse>(Endpoints.login, { method: "POST", body: loginData })
}

