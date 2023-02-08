

import { Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { DirectoryItem } from "../models/DirectoryItem"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { ax } from "./ax"



export type DirectoryItemListResponse = { items: DirectoryItem[] } & BaseResponse

const directoryLs = (path?: string) => {
   return ax<DirectoryItemListResponse>(Endpoints['drive.directory'] + `?path=${path ?? '/'}`) 
}

export default directoryLs