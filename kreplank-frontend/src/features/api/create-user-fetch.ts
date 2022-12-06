import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { customFetch } from "./custom-fetch"


const createUser = (request: CreateUserRequest) => {



   return customFetch(Endpoints.sign, 'PUT', request)
}

export default createUser