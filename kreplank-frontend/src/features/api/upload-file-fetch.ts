

import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { customFetch } from "./custom-fetch"


const uploadFile = (request: any) => { // TODO Change to typeof MultiPartData

   return customFetch(Endpoints["drive.upload"], "POST", request)
}

export default uploadFile