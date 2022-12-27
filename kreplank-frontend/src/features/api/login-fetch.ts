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

    if (!DEV_MODE) {
        if (!loginData.email && loginData.type == 'EMAIL')
            throw Error("cant login via email cause email is not provided")
        if (!loginData.nickname && loginData.type == 'NICKNAME')
            throw Error("cant login via nickname cause nickname is not provided")
    }


    var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjgxMDgxMjgsImlhdCI6MTY2ODEwNDUyOCwiaXNzIjoid3d3LmFjbWUuY29tIiwic3ViIjoiZjFlMzNhYjMtMDI3Zi00N2M1LWJiMDctOGRkOGFiMzdhMmQzIn0.5BOe2XBZA0K7P9bNh_ZhKFHvk1intmMP_KEvTbyEUwc");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "nickname": "adam123",
      "password": "adam123",
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

