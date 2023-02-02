

import axios, { AxiosResponse } from "axios"
import { backendUrlStorage, Endpoints, jwtTokenStorage } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { UserMe } from "../models/UserMe"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"




const deleteAccount = (nickname: string) => {
    const url = Endpoints["delete.user"].replace(':userId:', nickname)
    return ax<BaseResponse>(url, 'DELETE')

}

export default deleteAccount