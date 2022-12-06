import { Endpoints } from "../config"
import { CreateProjectRequestBody } from "../models/request/CreateProjectRequest"
import { customFetch } from "./custom-fetch"


const createProject = (createProjectRequest: CreateProjectRequestBody) => {
    

    return customFetch(Endpoints["edit.project"], 'POST', ,createProjectRequest)
}

export default createProject