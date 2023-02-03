

import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const uploadFile = (directoryPath: string, files: File) => { // TODO set query param

   return ax(Endpoints["drive.path"] + directoryPath, 'POST', { file: files })
}

export default uploadFile