import { AxiosResponse } from "axios"
import { DEV_MODE, Endpoints } from "../config"
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

    if (!DEV_MODE) {
        if (!loginData.email && loginData.type == 'EMAIL')
            throw Error("cant login via email cause email is not provided")
        if (!loginData.nickname && loginData.type == 'NICKNAME')
            throw Error("cant login via nickname cause nickname is not provided")
    }


    var raw = {
        "email": "random@email.com",
        "password": "adam123",
        "type": "EMAIL"
    };


    return customFetch<AxiosResponse<LoginResponse>>(Endpoints.login, 'POST', raw)
}

