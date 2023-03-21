import { Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { CharPostRequest, ChatPost } from "../models/ChatMessage"
import { Project } from "../models/Project"
import { CreateProjectRequestBody } from "../models/request/CreateProjectRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const deleteChatPost = (postId: string) => {
    const url = Endpoints["chat.delete"].replace(":postId:", postId)
    return ax<BaseResponse>(url, 'DELETE')
}

export default deleteChatPost