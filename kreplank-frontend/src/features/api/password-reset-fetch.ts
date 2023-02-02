import { AxiosResponse } from "axios"
import { DEV_MODE, Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { User } from "../models/User"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


export type PasswordResetRequest = {
  uuid:string,
  password:string
}




export function passwordReset(request: PasswordResetRequest) {
    return ax(Endpoints["password.reset"],"POST",request)
}

