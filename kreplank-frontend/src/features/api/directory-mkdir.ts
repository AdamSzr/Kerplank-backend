

import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"


const directoryMkDir = (path?: string) => {
   return ax(Endpoints['drive.mkdir'] + `?path=${path ?? '/'}`)
}

export default directoryMkDir