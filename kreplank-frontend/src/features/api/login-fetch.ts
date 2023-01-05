import { AxiosResponse } from "axios"
import { DEV_MODE, Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { ax } from "./ax"
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


export function login(loginData: LoginCredentials):Promise<LoginResponse> {
    console.log({loginData})
    if (!DEV_MODE) {
        if (!loginData.email && loginData.type == 'EMAIL')
            throw Error("cant login via email cause email is not provided")
        if (!loginData.nickname && loginData.type == 'NICKNAME')
            throw Error("cant login via nickname cause nickname is not provided")
    }


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "nickname": loginData.nickname,
      "password": loginData.password,
      "type": "NICKNAME"
    });
    
    var requestOptions :RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
   return fetch("http://192.168.1.22:8080/api/user/login", requestOptions)
      .then(response => response.json())

}

