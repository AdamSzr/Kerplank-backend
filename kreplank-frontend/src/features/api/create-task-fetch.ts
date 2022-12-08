import { Endpoints } from "../config"
import { CreateTaskRequestBody } from "../models/request/CreateTaskRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const createTask = (request: CreateTaskRequestBody) => {

    return ax(Endpoints["edit.task"], 'POST', request)
}

export default createTask