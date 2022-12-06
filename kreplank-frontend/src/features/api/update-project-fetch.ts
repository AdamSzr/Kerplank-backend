import { Endpoints } from "../config"
import { UpdateProjectRequest } from "../models/request/UpdateProjectRequest"
import { customFetch } from "./custom-fetch"

const updateProject = (updateProjectRequest: UpdateProjectRequest) => {

    return customFetch(Endpoints["edit.project"], 'POST', updateProjectRequest)
}

export default updateProject