

import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const downloadFile = (directoryPath:string) => { // TODO set query param

   
   return ax(Endpoints["drive.file"])
}

export default downloadFile