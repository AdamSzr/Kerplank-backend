import { Endpoints } from "../config"
import { CreateTaskRequestBody } from "../models/request/CreateTaskRequest"
import { ax } from "./ax"


const createTaskFetch = (request: CreateTaskRequestBody) => {

    return ax(Endpoints["create.task"], 'POST', request)
}

export default createTaskFetch