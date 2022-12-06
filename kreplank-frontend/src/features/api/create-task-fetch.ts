import { Endpoints } from "../config"
import { CreateTaskRequestBody } from "../models/request/CreateTaskRequest"
import { customFetch } from "./custom-fetch"


const createTask = (request: CreateTaskRequestBody) => {

    return customFetch(Endpoints["edit.task"], 'POST', request)
}

export default createTask