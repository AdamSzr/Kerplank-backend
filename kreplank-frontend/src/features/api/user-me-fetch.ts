

import axios, { AxiosResponse } from "axios"
import { backendUrlStorage, Endpoints, jwtTokenStorage } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { UserMe } from "../models/UserMe"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"



export type WhoAmIResponse  = UserMe & BaseResponse

const whoAmI = () => {
    return ax<WhoAmIResponse>(Endpoints.userMe)
   
}

export default whoAmI