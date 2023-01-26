import { Endpoints } from "../config"
import { BaseResponse } from "../models/BaseResponse"
import { Project } from "../models/Project"
import { CreateTaskRequestBody } from "../models/request/CreateTaskRequest"
import { ax } from "./ax"


const createTaskFetch = (request: CreateTaskRequestBody) => {

    return ax<{ project: Project } & BaseResponse>(Endpoints["create.task"], 'POST', request)
}

export default createTaskFetch