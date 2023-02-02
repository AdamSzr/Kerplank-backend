

import axios, { AxiosResponse } from "axios"
import { backendUrlStorage, Endpoints, jwtTokenStorage } from "../config"
import { BaseResponse, ListResponse } from "../models/BaseResponse"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { User } from "../models/User"
import { UserMe } from "../models/UserMe"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"



export type UserListResponse  = ListResponse<User> & BaseResponse

const downloadAllUsers = () => {
    return ax<UserListResponse>(Endpoints["users.all"])
   
}

export default downloadAllUsers