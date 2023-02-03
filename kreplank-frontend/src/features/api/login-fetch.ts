import { AxiosResponse } from "axios"
import { DEV_MODE, Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { User } from "../models/User"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


export type LoginCredentials = {
    email?: string,
    password: string,
    nickname?: string,
    type: "EMAIL" | "NICKNAME"
}


export type LoginResponse = {
    token: string,
    user:User
} & BaseResponse


export function login(loginData: LoginCredentials) {
    console.log({loginData})
    if (!DEV_MODE) {
        if (!loginData.email && loginData.type == 'EMAIL')
            throw Error("cant login via email cause email is not provided")
        if (!loginData.nickname && loginData.type == 'NICKNAME')
            throw Error("cant login via nickname cause nickname is not provided")
    }


    const request = {
        nickname: loginData.nickname,
        password: loginData.password,
        type: "NICKNAME"
      }

    return ax<LoginResponse>(Endpoints.login,"POST",request)
}

