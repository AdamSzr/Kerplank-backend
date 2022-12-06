

import axios, { AxiosResponse } from "axios"
import { Endpoints, jwtTokenStorage } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { UserMe } from "../models/UserMe"
import { customFetch } from "./custom-fetch"


const whoAmI = () => {

    return axios.get<AxiosResponse<UserMe & BaseResponse>>("http://localhost:8080" + Endpoints.userMe, { headers: { "Authorization": jwtTokenStorage.getOrThrow() } })

    return customFetch<UserMe & BaseResponse>(Endpoints.userMe)
}

export default whoAmI