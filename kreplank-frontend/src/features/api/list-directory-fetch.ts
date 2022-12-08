

import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const uploadFile = (directoryPath:string) => { // TODO set query param

   directoryPath
   return ax(Endpoints["drive.path"])
}

export default uploadFile