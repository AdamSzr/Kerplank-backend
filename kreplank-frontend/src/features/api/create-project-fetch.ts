import { Endpoints } from "../config"
import { CreateProjectRequestBody } from "../models/request/CreateProjectRequest"
import { ax } from "./ax"
import { customFetch } from "./custom-fetch"


const createProject = (createProjectRequest: CreateProjectRequestBody) => {
    

    return ax(Endpoints["edit.project"], 'POST', createProjectRequest)
}

export default createProject