

import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { customFetch } from "./custom-fetch"


const directoryRootPath = () => {

   return customFetch(Endpoints["drive.directory"])
}

export default directoryRootPath