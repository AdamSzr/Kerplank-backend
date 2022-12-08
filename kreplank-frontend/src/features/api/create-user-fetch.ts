import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const createUser = (request: CreateUserRequest) => {



   return ax(Endpoints.sign, 'PUT', request)
}

export default createUser