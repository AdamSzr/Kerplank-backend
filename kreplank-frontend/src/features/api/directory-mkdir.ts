

import { Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { DirectoryItem } from "../models/DirectoryItem"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"


const directoryMkDir = (path?: string) => {
   return ax<{item:DirectoryItem} & BaseResponse>(Endpoints['drive.mkdir'] + `?path=${path ?? '/'}`)
}

export default directoryMkDir