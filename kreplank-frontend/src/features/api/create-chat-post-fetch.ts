import { Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { CharPostRequest, ChatPost } from "../models/ChatMessage"
import { Project } from "../models/Project"
import { CreateProjectRequestBody } from "../models/request/CreateProjectRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const createChatPost = (request: CharPostRequest) => {
    return ax<{post:ChatPost} & BaseResponse>(Endpoints['chat.create'], 'POST', request)  
}

export default createChatPost