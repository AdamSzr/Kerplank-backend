

import { Endpoints } from "../config"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"


const directoryRootPath = () => {

   return ax(Endpoints["drive.directory"])
}

export default directoryRootPath