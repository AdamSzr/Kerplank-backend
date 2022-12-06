

import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { customFetch } from "./custom-fetch"


const downloadFile = (directoryPath:string) => { // TODO set query param

   directoryPath
   return customFetch(Endpoints["drive.file"])
}

export default downloadFile